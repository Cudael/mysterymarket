"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import { createIdeaSchema } from "@/features/ideas/schemas";
import { trackEvent } from "@/lib/analytics";

export async function createIdea(input: z.infer<typeof createIdeaSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  checkRateLimit(`createIdea:${userId}`, { interval: 60_000, maxRequests: 10 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const validated = createIdeaSchema.parse(input);

  const sanitized = {
    ...validated,
    teaserText: validated.teaserText ? sanitizeHtml(validated.teaserText) : validated.teaserText,
    hiddenContent: sanitizeHtml(validated.hiddenContent),
  };

  const idea = await prisma.idea.create({
    data: {
      ...sanitized,
      teaserImageUrl: sanitized.teaserImageUrl || null,
      tags: sanitized.tags ?? [],
      published: sanitized.published ?? false,
      creatorId: user.id,
    },
  });

  trackEvent("creator_idea_created", {
    creatorId: user.id,
    ideaId: idea.id,
    published: idea.published,
  });

  if (idea.published) {
    trackEvent("creator_idea_published", {
      creatorId: user.id,
      ideaId: idea.id,
    });
  }

  revalidatePath("/creator");
  revalidatePath("/ideas");
  return idea;
}

export async function updateIdea(
  ideaId: string,
  input: Partial<z.infer<typeof createIdeaSchema>>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea || idea.creatorId !== user.id) throw new Error("Idea not found or unauthorized");

  const sanitizedInput = {
    ...input,
    ...(input.teaserText !== undefined && { teaserText: input.teaserText ? sanitizeHtml(input.teaserText) : input.teaserText }),
    ...(input.hiddenContent !== undefined && { hiddenContent: sanitizeHtml(input.hiddenContent) }),
  };

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      ...sanitizedInput,
      teaserImageUrl: sanitizedInput.teaserImageUrl !== undefined ? (sanitizedInput.teaserImageUrl || null) : undefined,
    },
  });

  revalidatePath("/creator");
  revalidatePath(`/ideas/${ideaId}`);
  return updated;
}

export async function deleteIdea(ideaId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { _count: { select: { purchases: true } } },
  });
  if (!idea || idea.creatorId !== user.id) throw new Error("Idea not found or unauthorized");
  if (idea._count.purchases > 0) throw new Error("Cannot delete an idea that has been purchased");

  await prisma.idea.delete({ where: { id: ideaId } });
  revalidatePath("/creator");
  revalidatePath("/ideas");
}

export async function publishIdea(ideaId: string, published: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea || idea.creatorId !== user.id) throw new Error("Idea not found or unauthorized");

  await prisma.idea.update({
    where: { id: ideaId },
    data: { published },
  });

  if (published) {
    trackEvent("creator_idea_published", {
      creatorId: user.id,
      ideaId,
    });
  }

  revalidatePath("/creator");
  revalidatePath("/ideas");
  revalidatePath(`/ideas/${ideaId}`);
}

export async function getIdeasByCreator() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return [];

  return await prisma.idea.findMany({
    where: { creatorId: user.id },
    include: {
      _count: { select: { purchases: true } },
      purchases: { select: { amountInCents: true, platformFeeInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getIdeaById(ideaId: string) {
  return await prisma.idea.findUnique({
    where: { id: ideaId },
    include: {
      creator: { select: { id: true, name: true, avatarUrl: true, clerkId: true } },
      _count: { select: { purchases: true } },
    },
  });
}

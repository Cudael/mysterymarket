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

  const { subcategory: subcategoryName, maturityLevel, ...rest } = validated;

  const sanitized = {
    ...rest,
    teaserText: rest.teaserText ? sanitizeHtml(rest.teaserText) : rest.teaserText,
    hiddenContent: sanitizeHtml(rest.hiddenContent),
  };

  // Resolve subcategoryId from slug if provided (slug has a unique index)
  let subcategoryId: string | undefined;
  if (subcategoryName) {
    const subcat = await prisma.subcategory.findUnique({ where: { slug: subcategoryName } });
    if (subcat) subcategoryId = subcat.id;
  }

  const idea = await prisma.idea.create({
    data: {
      ...sanitized,
      teaserImageUrl: sanitized.teaserImageUrl || null,
      tags: sanitized.tags ?? [],
      published: sanitized.published ?? false,
      creatorId: user.id,
      ...(subcategoryId && { subcategoryId }),
      ...(maturityLevel && { maturityLevel }),
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

  // Resolve subcategoryId from slug if provided (slug has a unique index)
  const { subcategory: subcategoryName, maturityLevel, ...restInput } = sanitizedInput;
  let subcategoryId: string | undefined | null;
  if (subcategoryName !== undefined) {
    if (subcategoryName) {
      const subcat = await prisma.subcategory.findUnique({ where: { slug: subcategoryName } });
      subcategoryId = subcat?.id ?? null;
    } else {
      subcategoryId = null;
    }
  }

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      ...restInput,
      teaserImageUrl: restInput.teaserImageUrl !== undefined ? (restInput.teaserImageUrl || null) : undefined,
      ...(subcategoryId !== undefined && { subcategoryId }),
      ...(maturityLevel !== undefined && { maturityLevel }),
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

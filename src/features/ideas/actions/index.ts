"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sanitizeHtml } from "@/lib/sanitize";
import { checkRateLimit } from "@/lib/rate-limit";
import { baseIdeaSchema, createIdeaSchema } from "@/features/ideas/schemas";
import { trackEvent } from "@/lib/analytics";
import { getPublishValidationIssues, type IdeaQualityInput } from "@/features/ideas/lib/quality";

function sanitizeIdeaText(input: Partial<z.infer<typeof createIdeaSchema>>) {
  return {
    ...input,
    ...(input.teaserText !== undefined && {
      teaserText: input.teaserText ? sanitizeHtml(input.teaserText) : input.teaserText,
    }),
    ...(input.hiddenContent !== undefined && input.hiddenContentType !== "FILE" && input.hiddenContentType !== "LINK" && {
      hiddenContent: sanitizeHtml(input.hiddenContent),
    }),
    ...(input.whatYoullGet !== undefined && {
      whatYoullGet: input.whatYoullGet ? sanitizeHtml(input.whatYoullGet) : input.whatYoullGet,
    }),
    ...(input.bestFitFor !== undefined && {
      bestFitFor: input.bestFitFor ? sanitizeHtml(input.bestFitFor) : input.bestFitFor,
    }),
    ...(input.implementationNotes !== undefined && {
      implementationNotes: input.implementationNotes
        ? sanitizeHtml(input.implementationNotes)
        : input.implementationNotes,
    }),
  };
}

function assertIdeaPublishable(input: IdeaQualityInput) {
  const issues = getPublishValidationIssues(input);
  if (issues.length === 0) return;

  throw new Error(issues[0]?.message ?? "This idea needs a few more details before publishing.");
}

export async function createIdea(input: z.infer<typeof createIdeaSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  checkRateLimit(`createIdea:${userId}`, { interval: 60_000, maxRequests: 10 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const validated = createIdeaSchema.parse(input);

  const { subcategory: subcategoryName, maturityLevel, ...rest } = validated;

  const sanitized = sanitizeIdeaText(rest);

  // Resolve subcategoryId from slug if provided (slug has a unique index)
  let subcategoryId: string | undefined;
  if (subcategoryName) {
    const subcat = await prisma.subcategory.findUnique({ where: { slug: subcategoryName } });
    if (subcat) subcategoryId = subcat.id;
  }

  const idea = await prisma.idea.create({
    data: {
      title: sanitized.title ?? validated.title,
      teaserText: sanitized.teaserText,
      teaserImageUrl: sanitized.teaserImageUrl || null,
      hiddenContent: sanitized.hiddenContent ?? validated.hiddenContent ?? "",
      hiddenContentType: validated.hiddenContentType ?? "TEXT",
      hiddenFileUrl: validated.hiddenFileUrl || null,
      hiddenLinkUrl: validated.hiddenLinkUrl || null,
      originalityConfirmed:
        sanitized.originalityConfirmed ?? validated.originalityConfirmed,
      whatYoullGet: sanitized.whatYoullGet,
      bestFitFor: sanitized.bestFitFor,
      implementationNotes: sanitized.implementationNotes,
      priceInCents: sanitized.priceInCents ?? validated.priceInCents,
      unlockType: sanitized.unlockType ?? validated.unlockType,
      maxUnlocks: sanitized.maxUnlocks,
      category: sanitized.category,
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

  const validatedInput = baseIdeaSchema.partial().parse(input);
  const sanitizedInput = sanitizeIdeaText(validatedInput);
  const nextIdeaState = {
    ...idea,
    ...sanitizedInput,
    tags: sanitizedInput.tags ?? idea.tags,
  };

  if (nextIdeaState.published) {
    assertIdeaPublishable(nextIdeaState);
  }

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
      hiddenFileUrl: restInput.hiddenFileUrl !== undefined ? (restInput.hiddenFileUrl || null) : undefined,
      hiddenLinkUrl: restInput.hiddenLinkUrl !== undefined ? (restInput.hiddenLinkUrl || null) : undefined,
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

  if (published) {
    assertIdeaPublishable(idea);
  }

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
      creator: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          clerkId: true,
          stripeOnboarded: true,
        },
      },
      subcategory: { select: { slug: true } },
      _count: { select: { purchases: true } },
    },
  });
}

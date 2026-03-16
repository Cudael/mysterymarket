"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { trackEvent } from "@/lib/analytics";
import { createNotification } from "@/features/notifications/actions";

async function getAuthenticatedPrismaUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  return user;
}

export async function createReview(
  ideaId: string,
  rating: number,
  comment?: string
) {
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");

  const user = await getAuthenticatedPrismaUser();

  const purchase = await prisma.purchase.findUnique({
    where: { buyerId_ideaId: { buyerId: user.id, ideaId } },
  });
  if (!purchase || purchase.status !== "COMPLETED") {
    throw new Error("You must purchase this idea before reviewing it");
  }

  const existing = await prisma.review.findUnique({
    where: { buyerId_ideaId: { buyerId: user.id, ideaId } },
  });
  if (existing) throw new Error("You have already reviewed this idea");

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    select: { title: true, creatorId: true },
  });

  await prisma.review.create({
    data: {
      rating,
      comment: comment?.trim() || null,
      buyerId: user.id,
      ideaId,
    },
  });

  if (idea) {
    await createNotification({
      userId: idea.creatorId,
      type: "REVIEW",
      title: "New Review",
      message: `${user.name ?? "Someone"} left a ${rating}-star review on '${idea.title}'`,
      link: `/ideas/${ideaId}`,
    });
  }

  trackEvent("review_submitted", {
    userId: user.id,
    ideaId,
    rating,
  });

  revalidatePath(`/ideas/${ideaId}`);
}

export async function getReviewsForIdea(ideaId: string) {
  return await prisma.review.findMany({
    where: { ideaId },
    include: { buyer: { select: { name: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAverageRating(ideaId: string) {
  const result = await prisma.review.aggregate({
    where: { ideaId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count.rating,
  };
}

export async function getUserReviews() {
  const user = await getAuthenticatedPrismaUser();

  return prisma.review.findMany({
    where: { buyerId: user.id },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          teaserText: true,
          teaserImageUrl: true,
          category: true,
          priceInCents: true,
          creator: { select: { id: true, name: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPurchasesWithoutReviews() {
  const user = await getAuthenticatedPrismaUser();

  return prisma.purchase.findMany({
    where: {
      buyerId: user.id,
      status: "COMPLETED",
      idea: {
        reviews: {
          none: { buyerId: user.id },
        },
      },
    },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          category: true,
          creator: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

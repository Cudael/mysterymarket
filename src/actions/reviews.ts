"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createReview(
  ideaId: string,
  rating: number,
  comment?: string
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

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

  await prisma.review.create({
    data: {
      rating,
      comment: comment?.trim() || null,
      buyerId: user.id,
      ideaId,
    },
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

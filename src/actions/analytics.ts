"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCreatorAnalytics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  // Get all creator's ideas with purchases and reviews
  const ideas = await prisma.idea.findMany({
    where: { creatorId: user.id },
    include: {
      purchases: {
        where: { status: "COMPLETED" },
        include: {
          buyer: { select: { name: true } },
        },
      },
      reviews: {
        select: { rating: true },
      },
      _count: { select: { purchases: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Total revenue (net after platform fee)
  const totalRevenue = ideas.reduce(
    (sum, idea) =>
      sum +
      idea.purchases.reduce(
        (s, p) => s + (p.amountInCents - p.platformFeeInCents),
        0
      ),
    0
  );

  // Total sales (completed only, matching revenue calculation)
  const totalSales = ideas.reduce((sum, idea) => sum + idea.purchases.length, 0);

  // Average rating across all ideas
  const allRatings = ideas.flatMap((idea) => idea.reviews.map((r) => r.rating));
  const averageRating =
    allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;

  // Total reviews
  const totalReviews = allRatings.length;

  // Active (published) ideas count
  const activeIdeas = ideas.filter((idea) => idea.published).length;

  // Revenue by month (last 12 months) — single pass over all purchases
  const now = new Date();
  const monthRevenueMap = new Map<string, number>();
  const monthLabels: { key: string; label: string }[] = Array.from(
    { length: 12 },
    (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      monthRevenueMap.set(key, 0);
      return { key, label };
    }
  );

  for (const idea of ideas) {
    for (const p of idea.purchases) {
      const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
      if (monthRevenueMap.has(key)) {
        monthRevenueMap.set(
          key,
          monthRevenueMap.get(key)! + (p.amountInCents - p.platformFeeInCents)
        );
      }
    }
  }

  const revenueByMonth = monthLabels.map(({ key, label }) => ({
    month: label,
    revenue: monthRevenueMap.get(key)!,
  }));

  // Top performing ideas (top 5 by revenue)
  const topIdeas = ideas
    .map((idea) => {
      const revenue = idea.purchases.reduce(
        (sum, p) => sum + (p.amountInCents - p.platformFeeInCents),
        0
      );
      const ratings = idea.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      return {
        id: idea.id,
        title: idea.title,
        salesCount: idea._count.purchases,
        revenue,
        averageRating: avgRating,
        published: idea.published,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Recent sales (last 10)
  const allPurchases = ideas
    .flatMap((idea) =>
      idea.purchases.map((p) => ({
        id: p.id,
        buyerName: p.buyer.name,
        ideaTitle: idea.title,
        amount: p.amountInCents,
        platformFee: p.platformFeeInCents,
        date: p.createdAt,
      }))
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 10);

  return {
    stats: {
      totalRevenue,
      totalSales,
      averageRating,
      totalReviews,
      activeIdeas,
      totalIdeas: ideas.length,
    },
    revenueByMonth,
    topIdeas,
    recentSales: allPurchases,
  };
}

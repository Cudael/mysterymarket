"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { syncUser } from "@/features/users/actions";

export async function getCreatorAnalytics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    try {
      user = await syncUser();
    } catch {
      throw new Error("User not found");
    }
  }

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

export async function getBuyerAnalytics() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    try {
      user = await syncUser();
    } catch {
      throw new Error("User not found");
    }
  }

  // Query all completed purchases for this buyer
  const purchases = await prisma.purchase.findMany({
    where: { buyerId: user.id, status: "COMPLETED" },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          category: true,
          priceInCents: true,
          creatorId: true,
          creator: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Stats
  const totalSpent = purchases.reduce((sum, p) => sum + p.amountInCents, 0);
  const totalPurchases = purchases.length;
  const categories = purchases.map((p) => p.idea.category).filter(Boolean) as string[];
  const uniqueCategories = new Set(categories).size;
  const creatorIds = purchases.map((p) => p.idea.creatorId).filter(Boolean) as string[];
  const uniqueCreators = new Set(creatorIds).size;
  const averageSpent = totalPurchases > 0 ? Math.round(totalSpent / totalPurchases) : 0;
  const firstPurchaseDate =
    purchases.length > 0
      ? purchases.reduce((earliest, p) =>
          p.createdAt < earliest ? p.createdAt : earliest,
          purchases[0].createdAt
        )
      : null;

  // Spending by month (last 12 months)
  const now = new Date();
  const monthSpendMap = new Map<string, number>();
  const monthLabels: { key: string; label: string }[] = Array.from(
    { length: 12 },
    (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      monthSpendMap.set(key, 0);
      return { key, label };
    }
  );

  for (const p of purchases) {
    const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
    if (monthSpendMap.has(key)) {
      monthSpendMap.set(key, monthSpendMap.get(key)! + p.amountInCents);
    }
  }

  const spendingByMonth = monthLabels.map(({ key, label }) => ({
    month: label,
    amount: monthSpendMap.get(key)!,
  }));

  // Category breakdown
  const categoryMap = new Map<string, { count: number; totalSpent: number }>();
  for (const p of purchases) {
    const cat = p.idea.category ?? "Uncategorized";
    const existing = categoryMap.get(cat) ?? { count: 0, totalSpent: 0 };
    categoryMap.set(cat, {
      count: existing.count + 1,
      totalSpent: existing.totalSpent + p.amountInCents,
    });
  }
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([category, { count, totalSpent }]) => ({ category, count, totalSpent }))
    .sort((a, b) => b.count - a.count);

  // Purchase timeline (last 20)
  const purchaseTimeline = purchases.slice(0, 20).map((p) => ({
    id: p.idea.id,
    ideaTitle: p.idea.title,
    category: p.idea.category,
    creatorName: p.idea.creator?.name ?? null,
    amountInCents: p.amountInCents,
    date: p.createdAt,
  }));

  // Recommended ideas
  const purchasedIdeaIds = new Set(purchases.map((p) => p.idea.id));
  const topCategories = categoryBreakdown.slice(0, 3).map((c) => c.category);

  let recommendedIdeas = await prisma.idea.findMany({
    where: {
      published: true,
      category: topCategories.length > 0 ? { in: topCategories } : undefined,
      id: { notIn: Array.from(purchasedIdeaIds) },
      creatorId: { not: user.id },
    },
    select: {
      id: true,
      title: true,
      teaserText: true,
      category: true,
      priceInCents: true,
      unlockType: true,
      _count: { select: { purchases: true } },
      creator: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (recommendedIdeas.length < 6) {
    const existingIds = new Set([
      ...purchasedIdeaIds,
      ...recommendedIdeas.map((i) => i.id),
    ]);
    const filler = await prisma.idea.findMany({
      where: {
        published: true,
        id: { notIn: Array.from(existingIds) },
        creatorId: { not: user.id },
      },
      select: {
        id: true,
        title: true,
        teaserText: true,
        category: true,
        priceInCents: true,
        unlockType: true,
        _count: { select: { purchases: true } },
        creator: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 6 - recommendedIdeas.length,
    });
    recommendedIdeas = [...recommendedIdeas, ...filler];
  }

  return {
    stats: {
      totalSpent,
      totalPurchases,
      uniqueCategories,
      uniqueCreators,
      averageSpent,
      firstPurchaseDate,
    },
    spendingByMonth,
    categoryBreakdown,
    purchaseTimeline,
    recommendedIdeas: recommendedIdeas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      teaserText: idea.teaserText,
      category: idea.category,
      priceInCents: idea.priceInCents,
      unlockType: idea.unlockType,
      purchaseCount: idea._count.purchases,
      creatorName: idea.creator?.name ?? null,
    })),
  };
}

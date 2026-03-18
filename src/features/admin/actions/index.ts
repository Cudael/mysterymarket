"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { logger } from "@/lib/logger";
import { ReportStatus, ReportReason, Role, Prisma } from "@prisma/client";

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.role !== "ADMIN") throw new Error("Unauthorized: Admin access required");

  return user;
}

export async function getIsAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });
    return user?.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function getPlatformStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalCreators,
    totalIdeas,
    publishedIdeas,
    purchaseStats,
    refundedCount,
    pendingReports,
    pendingRefunds,
    recentPurchasesCount,
    recentPurchases,
    recentUsers,
    repeatBuyerRows,
    activeCreatorRows,
    topCategoryRows,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ["CREATOR", "ADMIN"] } } }),
    prisma.idea.count(),
    prisma.idea.count({ where: { published: true } }),
    prisma.purchase.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amountInCents: true, platformFeeInCents: true },
      _count: true,
    }),
    prisma.purchase.count({ where: { status: "REFUNDED" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.refundRequest.count({ where: { status: "PENDING" } }),
    prisma.purchase.count({
      where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.purchase.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        buyer: { select: { name: true, email: true } },
        idea: { select: { title: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true },
    }),
    prisma.purchase.groupBy({
      by: ["buyerId"],
      where: { status: "COMPLETED" },
      having: { buyerId: { _count: { gt: 1 } } },
    }),
    prisma.purchase.groupBy({
      by: ["ideaId"],
      where: { status: "COMPLETED" },
      _count: { ideaId: true },
    }),
    prisma.idea.groupBy({
      by: ["category"],
      where: { category: { not: null }, purchases: { some: { status: "COMPLETED" } } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
  ]);

  const totalCompleted = purchaseStats._count;
  const refundRate =
    totalCompleted + refundedCount > 0
      ? Math.round((refundedCount / (totalCompleted + refundedCount)) * 1000) / 10
      : 0;

  const topCategories = topCategoryRows.map((r) => ({
    category: r.category ?? "Uncategorized",
    count: r._count.id,
  }));

  return {
    totalUsers,
    totalCreators,
    totalIdeas,
    publishedIdeas,
    totalPurchases: purchaseStats._count,
    totalRevenue: purchaseStats._sum.amountInCents ?? 0,
    platformFeesEarned: purchaseStats._sum.platformFeeInCents ?? 0,
    pendingReports,
    pendingRefunds,
    refundRate,
    recentPurchasesCount,
    repeatBuyerCount: repeatBuyerRows.length,
    activeCreatorCount: activeCreatorRows.length,
    topCategories,
    recentPurchases,
    recentUsers,
  };
}

export async function getReports(status?: string, reason?: string) {
  await requireAdmin();

  const where: Prisma.ReportWhereInput = {};
  if (status && status !== "ALL") where.status = status as ReportStatus;
  if (reason && reason !== "ALL") where.reason = reason as ReportReason;

  return prisma.report.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      idea: {
        select: {
          id: true,
          title: true,
          published: true,
          priceInCents: true,
          category: true,
          creator: { select: { id: true, name: true, email: true } },
          _count: { select: { reports: true, purchases: true } },
        },
      },
    },
  });
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  action?: { unpublishIdea?: boolean }
) {
  await requireAdmin();

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: { idea: true },
  });
  if (!report) throw new Error("Report not found");

  await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  if (action?.unpublishIdea) {
    await prisma.idea.update({
      where: { id: report.ideaId },
      data: { published: false },
    });
    revalidatePath(`/ideas/${report.ideaId}`);
    revalidatePath("/ideas");
  }

  revalidatePath("/admin/reports");
}

export async function getRefundRequests(status?: string) {
  await requireAdmin();

  const where =
    status && status !== "ALL"
      ? { status: status as "PENDING" | "APPROVED" | "DENIED" }
      : undefined;

  return prisma.refundRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      purchase: {
        include: {
          buyer: { select: { id: true, name: true, email: true } },
          idea: {
            select: {
              id: true,
              title: true,
              creatorId: true,
              creator: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
  });
}

export async function updateRefundStatus(
  refundRequestId: string,
  status: "APPROVED" | "DENIED"
) {
  await requireAdmin();

  const refundRequest = await prisma.refundRequest.findUnique({
    where: { id: refundRequestId },
    include: {
      purchase: {
        include: {
          idea: { select: { creatorId: true, title: true } },
        },
      },
    },
  });
  if (!refundRequest) throw new Error("Refund request not found");
  if (refundRequest.status !== "PENDING") throw new Error("Refund request is not pending");

  await prisma.refundRequest.update({
    where: { id: refundRequestId },
    data: { status },
  });

  if (status === "APPROVED") {
    await prisma.purchase.update({
      where: { id: refundRequest.purchaseId },
      data: { status: "REFUNDED" },
    });

    const creatorId = refundRequest.purchase.idea.creatorId;
    const wallet = await prisma.wallet.findUnique({ where: { userId: creatorId } });
    if (wallet) {
      const refundAmount =
        refundRequest.purchase.amountInCents - refundRequest.purchase.platformFeeInCents;
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: { balanceInCents: { decrement: refundAmount } },
        }),
        prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: "REFUND_DEBIT",
            amountInCents: refundAmount,
            description: `Refund debit for '${refundRequest.purchase.idea.title}'`,
            referenceId: refundRequest.purchaseId,
          },
        }),
      ]);
    }
  }

  revalidatePath("/admin/refunds");
}

export async function getUsers(search?: string, role?: string, page = 1) {
  await requireAdmin();

  const PAGE_SIZE = 20;
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.UserWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role && role !== "ALL") {
    where.role = role as Role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        _count: {
          select: { ideas: true, purchases: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, pageSize: PAGE_SIZE };
}

export async function updateUserRole(userId: string, role: "USER" | "CREATOR" | "ADMIN") {
  const admin = await requireAdmin();

  if (admin.id === userId) throw new Error("Cannot change your own role");

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");
}

export async function getAdminIdeas(search?: string, status?: string, page = 1) {
  await requireAdmin();

  const PAGE_SIZE = 20;
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.IdeaWhereInput = {};
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }
  if (status === "published") {
    where.published = true;
  } else if (status === "unpublished") {
    where.published = false;
  }

  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        _count: {
          select: { purchases: true, reports: true, reviews: true },
        },
      },
    }),
    prisma.idea.count({ where }),
  ]);

  return { ideas, total, page, pageSize: PAGE_SIZE };
}

export async function toggleIdeaPublished(ideaId: string, published: boolean) {
  await requireAdmin();

  await prisma.idea.update({
    where: { id: ideaId },
    data: { published },
  });

  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/ideas");
  revalidatePath("/admin/ideas");
}

export async function adminGetWithdrawals(status?: string) {
  await requireAdmin();

  const where =
    status && status !== "ALL"
      ? { status: status as "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" }
      : undefined;

  return prisma.withdrawalRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      wallet: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              stripeAccountId: true,
              stripeOnboarded: true,
            },
          },
        },
      },
    },
  });
}

export async function adminApproveWithdrawal(withdrawalId: string) {
  await requireAdmin();

  const withdrawal = await prisma.withdrawalRequest.findUnique({
    where: { id: withdrawalId },
    include: {
      wallet: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              stripeAccountId: true,
              stripeOnboarded: true,
            },
          },
        },
      },
    },
  });

  if (!withdrawal) throw new Error("Withdrawal request not found");
  if (withdrawal.status !== "PENDING") throw new Error("Withdrawal is not pending");

  const user = withdrawal.wallet.user;
  if (!user.stripeAccountId) {
    throw new Error("Creator does not have a connected Stripe account");
  }

  await prisma.withdrawalRequest.update({
    where: { id: withdrawalId },
    data: { status: "PROCESSING" },
  });

  try {
    const transfer = await stripe.transfers.create({
      amount: withdrawal.amountInCents,
      currency: "usd", // Platform currency; extend if multi-currency support is added
      destination: user.stripeAccountId,
    });

    await prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: "COMPLETED",
        stripePayoutId: transfer.id,
        processedAt: new Date(),
      },
    });

    logger.info("Withdrawal approved and Stripe transfer created", {
      withdrawalId,
      transferId: transfer.id,
      userId: user.id,
    });
  } catch (err) {
    logger.error("Stripe transfer failed – reverting withdrawal to PENDING", err, {
      withdrawalId,
    });

    await prisma.$transaction([
      prisma.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: { status: "PENDING" },
      }),
      prisma.wallet.update({
        where: { id: withdrawal.walletId },
        data: {
          balanceInCents: { increment: withdrawal.amountInCents },
          totalWithdrawnInCents: { decrement: withdrawal.amountInCents },
        },
      }),
    ]);

    throw new Error(
      err instanceof Error ? err.message : "Stripe transfer failed. Withdrawal reverted to pending."
    );
  }

  revalidatePath("/admin/withdrawals");
}

export async function adminRejectWithdrawal(withdrawalId: string) {
  await requireAdmin();

  const withdrawal = await prisma.withdrawalRequest.findUnique({
    where: { id: withdrawalId },
    include: { wallet: true },
  });

  if (!withdrawal) throw new Error("Withdrawal request not found");
  if (withdrawal.status !== "PENDING") throw new Error("Withdrawal is not pending");

  await prisma.$transaction([
    prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: { status: "FAILED", processedAt: new Date() },
    }),
    prisma.wallet.update({
      where: { id: withdrawal.walletId },
      data: {
        balanceInCents: { increment: withdrawal.amountInCents },
        totalWithdrawnInCents: { decrement: withdrawal.amountInCents },
      },
    }),
    prisma.walletTransaction.create({
      data: {
        walletId: withdrawal.walletId,
        type: "EARNING",
        amountInCents: withdrawal.amountInCents,
        description: "Withdrawal rejected – funds returned",
        referenceId: withdrawal.id,
      },
    }),
  ]);

  logger.info("Withdrawal rejected and funds returned to wallet", { withdrawalId });

  revalidatePath("/admin/withdrawals");
}

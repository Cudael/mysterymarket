"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { ReportStatus, Role, Prisma } from "@prisma/client";

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

  const [
    totalUsers,
    totalCreators,
    totalIdeas,
    publishedIdeas,
    purchaseStats,
    pendingReports,
    pendingRefunds,
    recentPurchases,
    recentUsers,
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
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.refundRequest.count({ where: { status: "PENDING" } }),
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
  ]);

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
    recentPurchases,
    recentUsers,
  };
}

export async function getReports(status?: string) {
  await requireAdmin();

  const where =
    status && status !== "ALL" ? { status: status as ReportStatus } : undefined;

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
          creator: { select: { id: true, name: true, email: true } },
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
          idea: { select: { id: true, title: true, creatorId: true } },
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

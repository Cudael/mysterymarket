"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { createNotification } from "@/features/notifications/actions";

export async function createRefundRequest(purchaseId: string, reason: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { refundRequest: true },
  });
  if (!purchase) throw new Error("Purchase not found");
  if (purchase.buyerId !== user.id) throw new Error("Unauthorized");
  if (purchase.status !== "COMPLETED")
    throw new Error("Only completed purchases can be refunded");
  if (purchase.refundRequest) throw new Error("Refund request already exists");

  await prisma.refundRequest.create({
    data: {
      purchaseId,
      reason: reason.trim(),
    },
  });

  trackEvent("refund_requested", {
    userId: user.id,
    purchaseId,
    ideaId: purchase.ideaId,
  });
}

export async function getRefundRequestsForUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  return prisma.refundRequest.findMany({
    where: { purchase: { buyerId: user.id } },
    include: { purchase: { select: { ideaId: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateRefundStatus(
  refundRequestId: string,
  status: "APPROVED" | "DENIED"
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized");

  const refundRequest = await prisma.refundRequest.findUnique({
    where: { id: refundRequestId },
    include: {
      purchase: {
        include: { idea: { select: { title: true } } },
      },
    },
  });
  if (!refundRequest) throw new Error("Refund request not found");

  await prisma.refundRequest.update({
    where: { id: refundRequestId },
    data: { status },
  });

  const statusLabel = status === "APPROVED" ? "approved" : "denied";
  await createNotification({
    userId: refundRequest.purchase.buyerId,
    type: "REFUND",
    title: "Refund Update",
    message: `Your refund request for '${refundRequest.purchase.idea.title}' has been ${statusLabel}`,
    link: "/dashboard",
  });
}

"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

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

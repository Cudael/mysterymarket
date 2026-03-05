"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { NotificationType } from "@prisma/client";

export async function getNotifications(limit = 50) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    prisma.notification.count({
      where: { userId: user.id, read: false },
    }),
  ]);

  return { notifications, unreadCount };
}

export async function getUnreadCount(): Promise<number> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return 0;

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return 0;

  return prisma.notification.count({
    where: { userId: user.id, read: false },
  });
}

export async function markAsRead(notificationId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Not authenticated");

  checkRateLimit(`notifications:mark-read:${clerkId}`, {
    interval: 60_000,
    maxRequests: 30,
  });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });
  if (!notification || notification.userId !== user.id) {
    throw new Error("Notification not found");
  }

  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllRead() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Not authenticated");

  checkRateLimit(`notifications:mark-all-read:${clerkId}`, {
    interval: 60_000,
    maxRequests: 30,
  });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
}

export async function createNotification(data: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}) {
  await prisma.notification.create({ data });
}

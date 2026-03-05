"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function toggleFollow(creatorId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  checkRateLimit(`follow:${userId}`, { interval: 60_000, maxRequests: 30 });

  const viewer = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!viewer) throw new Error("User not found");
  if (viewer.id === creatorId) throw new Error("You cannot follow yourself");

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: viewer.id, followingId: creatorId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId: viewer.id, followingId: creatorId },
    });
  }

  const followerCount = await prisma.follow.count({ where: { followingId: creatorId } });

  return { following: !existing, followerCount };
}

export async function getFollowStatus(creatorId: string) {
  const { userId } = await auth();

  const followerCount = await prisma.follow.count({ where: { followingId: creatorId } });

  if (!userId) return { isFollowing: false, followerCount };

  const viewer = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!viewer) return { isFollowing: false, followerCount };

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: viewer.id, followingId: creatorId } },
  });

  return { isFollowing: !!existing, followerCount };
}

export async function getFollowerCount(userId: string) {
  return prisma.follow.count({ where: { followingId: userId } });
}

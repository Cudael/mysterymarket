"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function toggleBookmark(ideaId: string): Promise<{ bookmarked: boolean }> {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Not authenticated");

  checkRateLimit(`bookmark:${clerkId}`, { interval: 60_000, maxRequests: 30 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const existing = await prisma.bookmark.findUnique({
    where: { userId_ideaId: { userId: user.id, ideaId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    revalidatePath(`/ideas/${ideaId}`);
    revalidatePath("/dashboard/bookmarks");
    return { bookmarked: false };
  }

  await prisma.bookmark.create({ data: { userId: user.id, ideaId } });
  revalidatePath(`/ideas/${ideaId}`);
  revalidatePath("/dashboard/bookmarks");
  return { bookmarked: true };
}

export async function getBookmarks() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  return prisma.bookmark.findMany({
    where: { userId: user.id },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          teaserText: true,
          teaserImageUrl: true,
          priceInCents: true,
          unlockType: true,
          category: true,
          published: true,
          creator: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { purchases: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function isBookmarked(ideaId: string): Promise<boolean> {
  const { userId: clerkId } = await auth();
  if (!clerkId) return false;

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return false;

  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_ideaId: { userId: user.id, ideaId } },
  });
  return !!bookmark;
}

export async function getBookmarkCount(ideaId: string): Promise<number> {
  return prisma.bookmark.count({ where: { ideaId } });
}

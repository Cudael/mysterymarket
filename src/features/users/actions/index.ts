"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function syncUser() {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (existingUser) {
    return await prisma.user.update({
      where: { clerkId: user.id },
      data: {
        email: user.emailAddresses[0]?.emailAddress ?? existingUser.email,
        name:
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
          existingUser.name,
        avatarUrl: user.imageUrl ?? existingUser.avatarUrl,
      },
    });
  }

  return await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || null,
      avatarUrl: user.imageUrl ?? null,
    },
  });
}

export async function getUserByClerkId(clerkId?: string) {
  const { userId } = await auth();
  const id = clerkId ?? userId;
  if (!id) return null;

  return await prisma.user.findUnique({
    where: { clerkId: id },
    include: {
      ideas: { include: { _count: { select: { purchases: true } } } },
      purchases: true,
    },
  });
}

const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
});

function normalizeSocialUrl(value?: string): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === "") return null;
  if (!value.startsWith("https://")) throw new Error(`URL must start with https://`);
  return value;
}

export async function updateProfile(
  data: z.infer<typeof updateProfileSchema>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const validated = updateProfileSchema.parse(data);

  const user = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      name: validated.name,
      bio: validated.bio,
      twitterUrl: normalizeSocialUrl(validated.twitterUrl),
      linkedinUrl: normalizeSocialUrl(validated.linkedinUrl),
      websiteUrl: normalizeSocialUrl(validated.websiteUrl),
    },
  });

  revalidatePath("/settings");
  return user;
}

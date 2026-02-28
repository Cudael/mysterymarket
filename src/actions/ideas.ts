"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createIdeaSchema = z.object({
  title: z.string().min(3).max(200),
  teaserText: z.string().max(500).optional(),
  teaserImageUrl: z.string().url().optional().or(z.literal("")),
  hiddenContent: z.string().min(10),
  priceInCents: z.number().int().min(99).max(100000),
  unlockType: z.enum(["EXCLUSIVE", "MULTI"]),
  maxUnlocks: z.number().int().min(1).optional().nullable(),
  category: z.string().max(50).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export async function createIdea(input: z.infer<typeof createIdeaSchema>) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");
  if (!user.stripeOnboarded) throw new Error("Please connect and complete your Stripe account setup before creating ideas.");

  const validated = createIdeaSchema.parse(input);

  const idea = await prisma.idea.create({
    data: {
      ...validated,
      teaserImageUrl: validated.teaserImageUrl || null,
      tags: validated.tags ?? [],
      creatorId: user.id,
    },
  });

  revalidatePath("/creator");
  revalidatePath("/ideas");
  return idea;
}

export async function updateIdea(
  ideaId: string,
  input: Partial<z.infer<typeof createIdeaSchema>>
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea || idea.creatorId !== user.id) throw new Error("Idea not found or unauthorized");

  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      ...input,
      teaserImageUrl: input.teaserImageUrl !== undefined ? (input.teaserImageUrl || null) : undefined,
    },
  });

  revalidatePath("/creator");
  revalidatePath(`/ideas/${ideaId}`);
  return updated;
}

export async function deleteIdea(ideaId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: { _count: { select: { purchases: true } } },
  });
  if (!idea || idea.creatorId !== user.id) throw new Error("Idea not found or unauthorized");
  if (idea._count.purchases > 0) throw new Error("Cannot delete an idea that has been purchased");

  await prisma.idea.delete({ where: { id: ideaId } });
  revalidatePath("/creator");
  revalidatePath("/ideas");
}

export async function publishIdea(ideaId: string, published: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea || idea.creatorId !== user.id) throw new Error("Idea not found or unauthorized");

  await prisma.idea.update({
    where: { id: ideaId },
    data: { published },
  });

  revalidatePath("/creator");
  revalidatePath("/ideas");
  revalidatePath(`/ideas/${ideaId}`);
}

export async function getIdeasByCreator() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return [];

  return await prisma.idea.findMany({
    where: { creatorId: user.id },
    include: {
      _count: { select: { purchases: true } },
      purchases: { select: { amountInCents: true, platformFeeInCents: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getIdeaById(ideaId: string) {
  return await prisma.idea.findUnique({
    where: { id: ideaId },
    include: {
      creator: { select: { id: true, name: true, avatarUrl: true, clerkId: true } },
      _count: { select: { purchases: true } },
    },
  });
}

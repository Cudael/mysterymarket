"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function createCheckoutSession(ideaId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, published: true },
    include: { creator: true },
  });
  if (!idea) throw new Error("Idea not found");

  if (idea.creatorId === user.id) throw new Error("Cannot buy your own idea");

  if (!idea.creator.stripeAccountId || !idea.creator.stripeOnboarded) {
    throw new Error("Creator payment account not set up");
  }

  // Check if already purchased
  const existingPurchase = await prisma.purchase.findUnique({
    where: { buyerId_ideaId: { buyerId: user.id, ideaId: idea.id } },
  });
  if (existingPurchase) throw new Error("Already purchased");

  // Check exclusive availability
  if (idea.unlockType === "EXCLUSIVE") {
    const existingPurchaseCount = await prisma.purchase.count({
      where: { ideaId: idea.id, status: "COMPLETED" },
    });
    if (existingPurchaseCount > 0)
      throw new Error("This exclusive idea has already been claimed");
  }

  const platformFeePercent =
    parseInt(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? "15", 10) / 100;
  const platformFeeAmount = Math.round(idea.priceInCents * platformFeePercent);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: idea.currency,
          product_data: {
            name: idea.title,
            description: idea.teaserText || "Unlock this idea",
          },
          unit_amount: idea.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: absoluteUrl(`/ideas/${ideaId}?purchased=true`),
    cancel_url: absoluteUrl(`/ideas/${ideaId}`),
    metadata: {
      ideaId: idea.id,
      buyerId: user.id,
      amountInCents: idea.priceInCents.toString(),
      platformFeeInCents: platformFeeAmount.toString(),
    },
    payment_intent_data: {
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: idea.creator.stripeAccountId,
      },
    },
  });

  // Create a pending purchase record
  await prisma.purchase.create({
    data: {
      buyerId: user.id,
      ideaId,
      amountInCents: idea.priceInCents,
      platformFeeInCents: platformFeeAmount,
      stripePaymentIntentId: session.payment_intent as string,
    },
  });

  return { url: session.url };
}

export async function verifyPurchase(ideaId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return false;

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return false;

  const purchase = await prisma.purchase.findUnique({
    where: {
      buyerId_ideaId: { buyerId: user.id, ideaId },
    },
  });

  return purchase?.status === "COMPLETED";
}

export async function getPurchasesByUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  return prisma.purchase.findMany({
    where: { buyerId: user.id, status: "COMPLETED" },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          teaserText: true,
          hiddenContent: true,
          priceInCents: true,
          creator: { select: { name: true, avatarUrl: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { checkRateLimit } from "@/lib/rate-limit";
import { debitWalletForPurchase, creditWallet } from "@/actions/wallet";
import { sendPurchaseConfirmationEmail } from "@/lib/emails/purchase-confirmation";
import { sendSaleNotificationEmail } from "@/lib/emails/sale-notification";

export async function createCheckoutSession(ideaId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  checkRateLimit(`createCheckout:${clerkId}`, { interval: 60_000, maxRequests: 10 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, published: true },
  });
  if (!idea) throw new Error("Idea not found");

  if (idea.creatorId === user.id) throw new Error("Cannot buy your own idea");

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
    success_url: absoluteUrl("/checkout/success?session_id={CHECKOUT_SESSION_ID}"),
    cancel_url: absoluteUrl("/checkout/cancel"),
    metadata: {
      ideaId: idea.id,
      buyerId: user.id,
      amountInCents: idea.priceInCents.toString(),
      platformFeeInCents: platformFeeAmount.toString(),
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

export async function purchaseWithWallet(ideaId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  checkRateLimit(`purchaseWallet:${clerkId}`, { interval: 60_000, maxRequests: 10 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, published: true },
    include: { creator: true },
  });
  if (!idea) throw new Error("Idea not found");

  if (idea.creatorId === user.id) throw new Error("Cannot buy your own idea");

  const existingPurchase = await prisma.purchase.findUnique({
    where: { buyerId_ideaId: { buyerId: user.id, ideaId: idea.id } },
  });
  if (existingPurchase) throw new Error("Already purchased");

  if (idea.unlockType === "EXCLUSIVE") {
    const existingPurchaseCount = await prisma.purchase.count({
      where: { ideaId: idea.id, status: "COMPLETED" },
    });
    if (existingPurchaseCount > 0)
      throw new Error("This exclusive idea has already been claimed");
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet || wallet.balanceInCents < idea.priceInCents) {
    throw new Error("Insufficient wallet balance");
  }

  const platformFeePercent =
    parseInt(process.env.STRIPE_PLATFORM_FEE_PERCENT ?? "15", 10) / 100;
  const platformFeeAmount = Math.round(idea.priceInCents * platformFeePercent);
  const netEarnings = idea.priceInCents - platformFeeAmount;

  const referenceId = `wallet_${crypto.randomUUID()}`;

  // Debit buyer wallet
  await debitWalletForPurchase(
    user.id,
    idea.priceInCents,
    `Purchase: ${idea.title}`,
    referenceId
  );

  // Credit creator wallet
  await creditWallet(
    idea.creatorId,
    netEarnings,
    `Sale: ${idea.title}`,
    referenceId
  );

  // Create completed purchase record
  const purchase = await prisma.purchase.create({
    data: {
      buyerId: user.id,
      ideaId,
      amountInCents: idea.priceInCents,
      platformFeeInCents: platformFeeAmount,
      stripePaymentIntentId: referenceId,
      status: "COMPLETED",
    },
  });

  // Send emails (non-blocking)
  try {
    await Promise.all([
      sendPurchaseConfirmationEmail(
        user.email,
        idea.title,
        idea.priceInCents,
        idea.id
      ),
      sendSaleNotificationEmail(
        idea.creator.email,
        idea.title,
        user.name ?? user.email,
        idea.priceInCents,
        platformFeeAmount,
        idea.id
      ),
    ]);
  } catch (err) {
    console.error("[purchaseWithWallet] Email sending failed:", err);
  }

  return { purchaseId: purchase.id };
}

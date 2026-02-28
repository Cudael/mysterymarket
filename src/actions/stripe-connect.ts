"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function createConnectAccount() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) throw new Error("User not found");

  if (user.stripeAccountId) {
    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: absoluteUrl("/creator/connect?refresh=true"),
      return_url: absoluteUrl("/creator/connect?success=true"),
      type: "account_onboarding",
    });
    return { url: accountLink.url };
  }

  const account = await stripe.accounts.create({
    type: "express",
    email: user.email,
    metadata: { userId: user.id, clerkId: userId },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  await prisma.user.update({
    where: { clerkId: userId },
    data: { stripeAccountId: account.id },
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: absoluteUrl("/creator/connect?refresh=true"),
    return_url: absoluteUrl("/creator/connect?success=true"),
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}

export async function getConnectAccountStatus() {
  const { userId } = await auth();
  if (!userId) return { connected: false, onboarded: false, accountId: null };

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || !user.stripeAccountId) {
    return { connected: false, onboarded: false, accountId: null };
  }

  try {
    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    const isOnboarded = account.details_submitted ?? false;

    if (isOnboarded && !user.stripeOnboarded) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { stripeOnboarded: true, role: "CREATOR" },
      });
    }

    return {
      connected: true,
      onboarded: isOnboarded,
      accountId: user.stripeAccountId,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    };
  } catch (error) {
    console.error("Failed to retrieve Stripe account:", error);
    return { connected: false, onboarded: false, accountId: user.stripeAccountId };
  }
}

export async function createAccountLink() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user?.stripeAccountId) throw new Error("No Stripe account found");

  const accountLink = await stripe.accountLinks.create({
    account: user.stripeAccountId,
    refresh_url: absoluteUrl("/creator/connect?refresh=true"),
    return_url: absoluteUrl("/creator/connect?success=true"),
    type: "account_onboarding",
  });

  return { url: accountLink.url };
}

export async function createStripeDashboardLink() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user?.stripeAccountId) throw new Error("No Stripe account found");

  const loginLink = await stripe.accounts.createLoginLink(user.stripeAccountId);
  return { url: loginLink.url };
}

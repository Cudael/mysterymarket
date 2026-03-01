import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { sendPurchaseConfirmationEmail } from "@/lib/emails/purchase-confirmation";
import { sendSaleNotificationEmail } from "@/lib/emails/sale-notification";
import { creditWalletForDeposit } from "@/actions/wallet";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { type: metaType, userId: depositUserId, amountInCents: depositAmountMetadata } = session.metadata ?? {};

      // Handle wallet deposit
      if (metaType === "wallet_deposit" && depositUserId && depositAmountMetadata && session.payment_intent) {
        const referenceId = session.payment_intent as string;
        const depositAmount = parseInt(depositAmountMetadata, 10);
        await creditWalletForDeposit(depositUserId, depositAmount, referenceId);
        break;
      }

      const { ideaId, buyerId } = session.metadata ?? {};

      if (ideaId && buyerId && session.payment_intent) {
        const paymentIntentId = session.payment_intent as string;

        // Idempotency: skip if already COMPLETED
        const existing = await prisma.purchase.findFirst({
          where: { stripePaymentIntentId: paymentIntentId, status: "COMPLETED" },
        });
        if (existing) break;

        await prisma.purchase.updateMany({
          where: { stripePaymentIntentId: paymentIntentId },
          data: { status: "COMPLETED" },
        });

        // Credit creator wallet and send emails
        try {
          const purchase = await prisma.purchase.findFirst({
            where: { stripePaymentIntentId: paymentIntentId },
            include: {
              buyer: true,
              idea: { include: { creator: true } },
            },
          });

          if (purchase) {
            const netEarnings = purchase.amountInCents - purchase.platformFeeInCents;

            const wallet = await prisma.wallet.upsert({
              where: { userId: purchase.idea.creatorId },
              create: { userId: purchase.idea.creatorId },
              update: {},
            });

            await prisma.$transaction([
              prisma.wallet.update({
                where: { id: wallet.id },
                data: {
                  balanceInCents: { increment: netEarnings },
                  totalEarnedInCents: { increment: netEarnings },
                },
              }),
              prisma.walletTransaction.create({
                data: {
                  walletId: wallet.id,
                  type: "EARNING",
                  amountInCents: netEarnings,
                  description: `Sale: ${purchase.idea.title}`,
                  referenceId: purchase.id,
                },
              }),
            ]);

            await sendPurchaseConfirmationEmail(
              purchase.buyer.email,
              purchase.idea.title,
              purchase.amountInCents,
              purchase.ideaId
            );
            await sendSaleNotificationEmail(
              purchase.idea.creator.email,
              purchase.idea.title,
              purchase.buyer.name ?? purchase.buyer.email,
              purchase.amountInCents,
              purchase.platformFeeInCents,
              purchase.ideaId
            );
          }
        } catch (emailErr) {
          console.error("[stripe-webhook] Post-purchase processing failed:", emailErr);
        }
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object;
      if (charge.payment_intent) {
        const purchase = await prisma.purchase.findFirst({
          where: { stripePaymentIntentId: charge.payment_intent as string },
          include: { idea: true },
        });

        await prisma.purchase.updateMany({
          where: { stripePaymentIntentId: charge.payment_intent as string },
          data: { status: "REFUNDED" },
        });

        if (purchase) {
          const netEarnings = purchase.amountInCents - purchase.platformFeeInCents;
          const wallet = await prisma.wallet.findUnique({
            where: { userId: purchase.idea.creatorId },
          });
          if (wallet && wallet.balanceInCents >= netEarnings) {
            await prisma.$transaction([
              prisma.wallet.update({
                where: { id: wallet.id },
                data: { balanceInCents: { decrement: netEarnings } },
              }),
              prisma.walletTransaction.create({
                data: {
                  walletId: wallet.id,
                  type: "REFUND_DEBIT",
                  amountInCents: netEarnings,
                  description: `Refund: ${purchase.idea.title}`,
                  referenceId: purchase.id,
                },
              }),
            ]);
          }
        }
      }
      break;
    }

    case "account.updated": {
      const account = event.data.object;
      if (account.charges_enabled) {
        await prisma.user.updateMany({
          where: { stripeAccountId: account.id },
          data: { stripeOnboarded: true },
        });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

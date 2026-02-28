import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Purchase Successful - MysteryIdea",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Invalid Session</h1>
        <p className="mt-2 text-muted-foreground">No session ID was provided.</p>
        <Button asChild className="mt-6">
          <Link href="/ideas">Browse Ideas</Link>
        </Button>
      </div>
    );
  }

  let ideaTitle: string | null = null;
  let amountPaid: number | null = null;
  let error = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    ideaTitle = session.metadata?.ideaTitle ?? null;
    amountPaid = session.amount_total;
  } catch {
    error = true;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">Session Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          We could not verify your purchase session. If you completed a payment, check your dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard">View Purchases</Link>
          </Button>
          <Button asChild>
            <Link href="/ideas">Browse Ideas</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Purchase Successful!</h1>
      {ideaTitle && (
        <p className="mt-2 text-lg text-foreground font-medium">{ideaTitle}</p>
      )}
      {amountPaid !== null && (
        <p className="mt-1 text-muted-foreground">
          You paid {formatPrice(amountPaid)}
        </p>
      )}
      <p className="mt-4 text-muted-foreground">
        The idea has been unlocked and is available in your dashboard.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard">View your purchases</Link>
        </Button>
        <Button asChild>
          <Link href="/ideas">Browse more ideas</Link>
        </Button>
      </div>
    </div>
  );
}

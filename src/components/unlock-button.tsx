"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle, Ban, ShieldOff, Wallet2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession, purchaseWithWallet } from "@/actions/purchases";
import { formatPrice } from "@/lib/utils";

interface UnlockButtonProps {
  ideaId: string;
  priceInCents: number;
  isExclusive: boolean;
  isPurchased: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  exclusiveClaimed: boolean;
  walletBalance?: number | null;
}

export function UnlockButton({
  ideaId,
  priceInCents,
  isExclusive,
  isPurchased,
  isAuthenticated,
  isOwner,
  exclusiveClaimed,
  walletBalance,
}: UnlockButtonProps) {
  const [loading, setLoading] = useState<"stripe" | "wallet" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasEnoughBalance = walletBalance != null && walletBalance >= priceInCents;

  if (!isAuthenticated) {
    return (
      <Button asChild size="lg" className="w-full gap-2">
        <Link href="/sign-in">
          <Lock className="h-4 w-4" />
          Sign in to unlock
        </Link>
      </Button>
    );
  }

  if (isOwner) {
    return (
      <Button size="lg" className="w-full gap-2" disabled>
        <ShieldOff className="h-4 w-4" />
        Your idea
      </Button>
    );
  }

  if (isPurchased) {
    return (
      <Button
        size="lg"
        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
        disabled
      >
        <CheckCircle className="h-4 w-4" />
        Already unlocked ✓
      </Button>
    );
  }

  if (isExclusive && exclusiveClaimed) {
    return (
      <Button size="lg" className="w-full gap-2" variant="secondary" disabled>
        <Ban className="h-4 w-4" />
        Already claimed
      </Button>
    );
  }

  async function handleStripeUnlock() {
    setLoading("stripe");
    setError(null);
    try {
      const result = await createCheckoutSession(ideaId);
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  async function handleWalletUnlock() {
    setLoading("wallet");
    setError(null);
    try {
      await purchaseWithWallet(ideaId);
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {hasEnoughBalance && (
        <Button
          size="lg"
          className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
          onClick={handleWalletUnlock}
          disabled={loading !== null}
        >
          <Wallet2 className="h-4 w-4" />
          {loading === "wallet"
            ? "Processing..."
            : `Pay with Wallet (${formatPrice(walletBalance ?? 0)} available)`}
        </Button>
      )}
      <Button
        size="lg"
        variant={hasEnoughBalance ? "outline" : "default"}
        className="w-full gap-2"
        onClick={handleStripeUnlock}
        disabled={loading !== null}
      >
        <Lock className="h-4 w-4" />
        {loading === "stripe"
          ? "Redirecting..."
          : `Unlock for ${formatPrice(priceInCents)}`}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}

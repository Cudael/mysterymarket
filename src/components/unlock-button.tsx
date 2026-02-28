"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, CheckCircle, Ban, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/actions/purchases";
import { formatPrice } from "@/lib/utils";

interface UnlockButtonProps {
  ideaId: string;
  priceInCents: number;
  isExclusive: boolean;
  isPurchased: boolean;
  isAuthenticated: boolean;
  isOwner: boolean;
  exclusiveClaimed: boolean;
}

export function UnlockButton({
  ideaId,
  priceInCents,
  isExclusive,
  isPurchased,
  isAuthenticated,
  isOwner,
  exclusiveClaimed,
}: UnlockButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        className="w-full gap-2 bg-green-600 hover:bg-green-600 text-white"
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

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    try {
      const result = await createCheckoutSession(ideaId);
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        className="w-full gap-2"
        onClick={handleUnlock}
        disabled={loading}
      >
        <Lock className="h-4 w-4" />
        {loading ? "Redirecting..." : `Unlock for ${formatPrice(priceInCents)}`}
      </Button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}

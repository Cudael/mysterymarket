"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createStripeDashboardLink } from "@/actions/stripe-connect";

interface PayoutInfoProps {
  connected: boolean;
  onboarded: boolean;
}

export function PayoutInfo({ connected, onboarded }: PayoutInfoProps) {
  const [loading, setLoading] = useState(false);

  async function handleViewDashboard() {
    setLoading(true);
    try {
      const { url } = await createStripeDashboardLink();
      window.open(url, "_blank");
    } catch {
      toast.error("Could not open Stripe dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payout Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          When a sale is completed, your earnings (minus the platform fee) are
          credited to your in-app wallet. You can withdraw your balance to your
          bank account at any time once you have connected your Stripe account.
        </p>
        {connected && onboarded ? (
          <Button onClick={handleViewDashboard} disabled={loading} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            {loading ? "Opening…" : "View Stripe Dashboard"}
          </Button>
        ) : (
          <p className="text-sm text-yellow-600">
            Connect and complete your Stripe account to manage payouts.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

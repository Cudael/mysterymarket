"use client";

import Link from "next/link";
import { Wallet2, TrendingUp, ArrowDownLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { WithdrawalDialog } from "@/components/withdrawal-dialog";

interface WalletBalanceProps {
  balanceInCents: number;
  totalEarnedInCents: number;
  totalWithdrawnInCents: number;
  stripeConnected: boolean;
}

export function WalletBalance({
  balanceInCents,
  totalEarnedInCents,
  totalWithdrawnInCents,
  stripeConnected,
}: WalletBalanceProps) {
  const canWithdraw = balanceInCents >= 1000 && stripeConnected;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet2 className="h-5 w-5" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="mt-1 text-4xl font-bold text-foreground">
            {formatPrice(balanceInCents)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Total Earned
              </span>
            </div>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatPrice(totalEarnedInCents)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <ArrowDownLeft className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">
                Total Withdrawn
              </span>
            </div>
            <p className="mt-1 text-lg font-semibold text-foreground">
              {formatPrice(totalWithdrawnInCents)}
            </p>
          </div>
        </div>

        {!stripeConnected && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
            <p className="text-sm text-muted-foreground">
              <Link
                href="/creator/connect"
                className="font-medium text-foreground underline hover:no-underline"
              >
                Connect Stripe
              </Link>{" "}
              to withdraw your earnings to your bank account.
            </p>
          </div>
        )}

        {stripeConnected && balanceInCents < 1000 && (
          <p className="text-sm text-muted-foreground">
            Minimum withdrawal is $10.00. Keep earning!
          </p>
        )}

        <div className="flex gap-2">
          {canWithdraw ? (
            <WithdrawalDialog balanceInCents={balanceInCents} />
          ) : (
            <Button size="sm" disabled>
              Withdraw
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href="/creator/connect">
              {stripeConnected ? "Stripe Settings" : "Connect Stripe"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

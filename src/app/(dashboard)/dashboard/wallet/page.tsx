import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Wallet2, ArrowDownCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWalletWithTransactions } from "@/actions/wallet";
import { WalletTransactions } from "@/components/wallet-transactions";
import { DepositDialog } from "@/components/deposit-dialog";
import { formatPrice } from "@/lib/utils";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "My Wallet - MysteryIdea",
};

export default async function BuyerWalletPage({
  searchParams,
}: {
  searchParams: Promise<{ deposit?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { deposit } = await searchParams;

  const { wallet, transactions } = await getWalletWithTransactions(50);

  // Compute totals from a single aggregation grouped by transaction type
  const typeTotals = await prisma.walletTransaction.groupBy({
    by: ["type"],
    where: { walletId: wallet.id },
    _sum: { amountInCents: true },
  });

  const getTotal = (type: string) =>
    typeTotals.find((t) => t.type === type)?._sum.amountInCents ?? 0;

  const totalDeposited = getTotal("DEPOSIT");
  const totalSpentInCents = getTotal("PURCHASE");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Wallet</h1>
          <p className="mt-1 text-muted-foreground">
            Deposit funds and pay for ideas without leaving the platform.
          </p>
        </div>
        <DepositDialog />
      </div>

      {deposit === "success" && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm font-medium text-green-700">
            ✓ Funds added successfully! Your balance has been updated.
          </p>
        </div>
      )}

      {/* Balance card */}
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
              {formatPrice(wallet.balanceInCents)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-green-600">
                <ArrowDownCircle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Total Deposited
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatPrice(totalDeposited)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-red-600">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Total Spent
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {formatPrice(totalSpentInCents)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <WalletTransactions transactions={transactions} />
    </div>
  );
}

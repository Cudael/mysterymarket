import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { getConnectAccountStatus } from "@/features/stripe/actions";
import { WalletBalance } from "@/features/wallet/components/wallet-balance";
import { WalletTransactions } from "@/features/wallet/components/wallet-transactions";

export const metadata: Metadata = {
  title: "Wallet - MysteryIdea",
};

export default async function WalletPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [{ wallet, transactions }, connectStatus] = await Promise.all([
    getWalletWithTransactions(20),
    getConnectAccountStatus(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
        <p className="mt-1 text-muted-foreground">
          Your earnings and withdrawal history.
        </p>
      </div>

      <WalletBalance
        balanceInCents={wallet.balanceInCents}
        totalEarnedInCents={wallet.totalEarnedInCents}
        totalWithdrawnInCents={wallet.totalWithdrawnInCents}
        stripeConnected={connectStatus.connected && connectStatus.onboarded}
      />

      <WalletTransactions transactions={transactions} />
    </div>
  );
}

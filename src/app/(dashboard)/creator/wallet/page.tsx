import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Wallet2 } from "lucide-react";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { getConnectAccountStatus } from "@/features/stripe/actions";
import { WalletBalance } from "@/features/wallet/components/wallet-balance";
import { WalletTransactions } from "@/features/wallet/components/wallet-transactions";

export const metadata: Metadata = {
  title: "Wallet - MysteryMarket",
};

export default async function WalletPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [{ wallet, transactions }, connectStatus] = await Promise.all([
    getWalletWithTransactions(20),
    getConnectAccountStatus(),
  ]);

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 space-y-8">
      <div className="border-b border-[#D9DCE3] pb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Wallet & Earnings</h1>
        <p className="mt-2 text-[15px] text-[#1A1A1A]/60">
          Manage your earnings, balance, and view your withdrawal history.
        </p>
      </div>

      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4 flex items-center gap-2.5">
          <Wallet2 className="h-5 w-5 text-[#3A5FCD]" />
          <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Balance Overview</h2>
        </div>
        <div className="p-6">
          <WalletBalance
            balanceInCents={wallet.balanceInCents}
            totalEarnedInCents={wallet.totalEarnedInCents}
            totalWithdrawnInCents={wallet.totalWithdrawnInCents}
            stripeConnected={connectStatus.connected && connectStatus.onboarded}
          />
        </div>
      </div>

      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Recent Transactions</h2>
        </div>
        <div className="p-0 sm:p-6">
          <WalletTransactions transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Wallet2, ReceiptText, CreditCard, ArrowRight } from "lucide-react";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { getConnectAccountStatus } from "@/features/stripe/actions";
import { WalletBalance } from "@/features/wallet/components/wallet-balance";
import { WalletTransactions } from "@/features/wallet/components/wallet-transactions";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Wallet - MysteryMarket",
};

export default async function StudioWalletPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [{ wallet, transactions }, connectStatus] = await Promise.all([
    getWalletWithTransactions(20),
    getConnectAccountStatus(),
  ]);

  const stripeReady = connectStatus.connected && connectStatus.onboarded;

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Wallet"
        description="Track your creator balance, understand earnings activity, and review recent transactions."
        icon={<Wallet2 className="h-6 w-6 text-white" />}
      />

      {!stripeReady && (
        <ContentCard bodyClassName="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
                <CreditCard className="h-5 w-5 text-[#3A5FCD]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#1A1A1A]">
                  Complete payout setup
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/60">
                  Your wallet can still receive earnings, but Stripe must be fully
                  connected before payouts can be enabled.
                </p>
              </div>
            </div>

            <Button asChild variant="outline">
              <Link href="/studio/payouts" className="gap-2">
                Open Payout Settings
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ContentCard>
      )}

      <ContentCard title="Balance Overview" titleIcon={Wallet2} bodyClassName="p-6">
        <WalletBalance
          balanceInCents={wallet.balanceInCents}
          totalEarnedInCents={wallet.totalEarnedInCents}
          totalWithdrawnInCents={wallet.totalWithdrawnInCents}
          stripeConnected={stripeReady}
        />
      </ContentCard>

      <ContentCard title="Recent Transactions" titleIcon={ReceiptText} bodyClassName="p-0 sm:p-6">
        <WalletTransactions transactions={transactions} />
      </ContentCard>
    </div>
  );
}

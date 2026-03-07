import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Wallet2, ReceiptText } from "lucide-react";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { getConnectAccountStatus } from "@/features/stripe/actions";
import { WalletBalance } from "@/features/wallet/components/wallet-balance";
import { WalletTransactions } from "@/features/wallet/components/wallet-transactions";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/shared/dashboard-card";

export const metadata: Metadata = {
  title: "Earnings & Wallet - MysteryMarket",
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
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Creator", href: "/creator" },
          { label: "Earnings" },
        ]}
      />
      <PageHeader
        title="Earnings & Wallet"
        description="Manage your earnings, balance, and view your withdrawal history."
        icon={<Wallet2 className="h-6 w-6 text-[#FFFFFF]" />}
      />

      <DashboardCard title="Balance Overview" titleIcon={Wallet2} bodyClassName="p-6">
        <WalletBalance
          balanceInCents={wallet.balanceInCents}
          totalEarnedInCents={wallet.totalEarnedInCents}
          totalWithdrawnInCents={wallet.totalWithdrawnInCents}
          stripeConnected={connectStatus.connected && connectStatus.onboarded}
        />
      </DashboardCard>

      <DashboardCard title="Recent Transactions" titleIcon={ReceiptText} bodyClassName="p-0 sm:p-6">
        <WalletTransactions transactions={transactions} />
      </DashboardCard>
    </div>
  );
}

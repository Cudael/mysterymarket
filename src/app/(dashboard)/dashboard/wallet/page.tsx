import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Wallet2, ArrowDownCircle, ShoppingCart } from "lucide-react";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { WalletTransactions } from "@/features/wallet/components/wallet-transactions";
import { DepositDialog } from "@/features/wallet/components/deposit-dialog";
import { formatPrice } from "@/lib/utils";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/shared/dashboard-card";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Wallet - MysteryMarket",
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
    <div className="mx-auto max-w-5xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Buyer Overview", href: "/dashboard" },
          { label: "Wallet" },
        ]}
      />
      <PageHeader
        title="Wallet"
        description="Deposit funds and pay for premium ideas without leaving the platform."
        icon={<Wallet2 className="h-6 w-6 text-[#FFFFFF]" />}
        action={<DepositDialog />}
      />

      {deposit === "success" && (
        <div className="rounded-[8px] border border-[#C8E6C9] bg-[#E8F5E9] p-4 shadow-sm">
          <p className="text-[14px] font-medium text-[#054F31] flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#4CAF50] text-white text-xs">✓</span>
            Funds added successfully! Your balance has been updated.
          </p>
        </div>
      )}

      <DashboardCard title="Balance Overview" titleIcon={Wallet2} bodyClassName="p-6 md:p-8 space-y-8">
        <div>
          <p className="text-[14px] font-medium uppercase tracking-wider text-[#1A1A1A]/50">Available Balance</p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-[#1A1A1A]">
            {formatPrice(wallet.balanceInCents)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-[10px] border border-[#D9DCE3] bg-[#F8F9FC] p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#054F31] mb-2">
              <ArrowDownCircle className="h-4 w-4" />
              <span className="text-[12px] font-bold uppercase tracking-wider">
                Total Deposited
              </span>
            </div>
            <p className="text-xl font-bold text-[#1A1A1A]">
              {formatPrice(totalDeposited)}
            </p>
          </div>

          <div className="rounded-[10px] border border-[#D9DCE3] bg-[#F8F9FC] p-4 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[#D32F2F] mb-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-[12px] font-bold uppercase tracking-wider">
                Total Spent
              </span>
            </div>
            <p className="text-xl font-bold text-[#1A1A1A]">
              {formatPrice(totalSpentInCents)}
            </p>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Transaction History" bodyClassName="p-6">
        <WalletTransactions transactions={transactions} />
      </DashboardCard>
    </div>
  );
}

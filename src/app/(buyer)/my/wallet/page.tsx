import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Wallet2, ArrowDownCircle, ShoppingCart, CheckCircle2 } from "lucide-react";
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
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Library", href: "/my" },
          { label: "Wallet" },
        ]}
      />

      <PageHeader
        title="Wallet"
        description="Add funds, manage your balance, and pay for premium ideas without leaving the platform."
        icon={<Wallet2 className="h-6 w-6 text-white" />}
        action={<DepositDialog />}
      />

      {deposit === "success" && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[#C8E6C9] bg-[#E8F5E9] p-4 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-[#054F31]" />
          <p className="text-[14px] font-medium text-[#054F31]">
            Funds added successfully. Your wallet balance has been updated.
          </p>
        </div>
      )}

      <DashboardCard title="Balance Overview" titleIcon={Wallet2} bodyClassName="p-6 md:p-8">
        <div className="space-y-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]/45">
              Available Balance
            </p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-[#1A1A1A]">
              {formatPrice(wallet.balanceInCents)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#054F31]">
                <ArrowDownCircle className="h-4 w-4" />
                <span className="text-[12px] font-bold uppercase tracking-[0.08em]">
                  Total Deposited
                </span>
              </div>
              <p className="text-xl font-bold text-[#1A1A1A]">
                {formatPrice(totalDeposited)}
              </p>
            </div>

            <div className="rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#D32F2F]">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-[12px] font-bold uppercase tracking-[0.08em]">
                  Total Spent
                </span>
              </div>
              <p className="text-xl font-bold text-[#1A1A1A]">
                {formatPrice(totalSpentInCents)}
              </p>
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Transaction History" bodyClassName="p-0 sm:p-6">
        <WalletTransactions transactions={transactions} />
      </DashboardCard>
    </div>
  );
}

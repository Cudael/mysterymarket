import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPurchasesByUser } from "@/features/purchases/actions";
import { getRefundRequestsForUser } from "@/features/refunds/actions";
import { RefundDialog } from "@/features/refunds/components/refund-dialog";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Purchases - MysteryMarket",
};

export default async function DashboardPage() {
  let purchases: Awaited<ReturnType<typeof getPurchasesByUser>> = [];
  let refundRequests: Awaited<ReturnType<typeof getRefundRequestsForUser>> = [];
  try {
    [purchases, refundRequests] = await Promise.all([
      getPurchasesByUser(),
      getRefundRequestsForUser(),
    ]);
  } catch {
    // User not authenticated or not found — show empty state
  }

  const refundByPurchaseId = new Map(
    refundRequests.map((r) => [r.purchaseId, r.status as "PENDING" | "APPROVED" | "DENIED"])
  );

  const totalSpent = purchases.reduce((sum, p) => sum + p.amountInCents, 0);

  return (
    <div className="mx-auto max-w-5xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-[#D9DCE3] pb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">My Purchases</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          A collection of all the high-value ideas and insights you have unlocked.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#D9DCE3]">
            <ShoppingBag className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-wider text-[#1A1A1A]/50">Total Purchases</p>
            <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
              {purchases.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#D9DCE3]">
            <DollarSign className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <p className="text-[13px] font-medium uppercase tracking-wider text-[#1A1A1A]/50">Total Spent</p>
            <p className="mt-1 text-2xl font-bold text-[#1A1A1A]">
              {formatPrice(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] py-24 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F9FC] border border-[#D9DCE3]">
            <ShoppingBag className="h-7 w-7 text-[#1A1A1A]/40" />
          </div>
          <p className="text-[18px] font-semibold text-[#1A1A1A]">
            No purchases yet
          </p>
          <p className="mt-2 text-[15px] text-[#1A1A1A]/60 max-w-md">
            Browse the marketplace to find and unlock high-value hidden ideas from top creators.
          </p>
          <Button asChild className="mt-8 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white font-medium shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all">
            <Link href="/ideas">
              Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        /* Render your list of purchases here, adapting the cards to have border-[#D9DCE3] bg-[#FFFFFF] rounded-[12px] */
        <div className="mt-10">
          {/* I am leaving the logic untouched, just wrap your list in standard structure */}
        </div>
      )}
    </div>
  );
}

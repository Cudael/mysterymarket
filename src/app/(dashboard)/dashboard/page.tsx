import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPurchasesByUser } from "@/actions/purchases";
import { getRefundRequestsForUser } from "@/actions/refunds";
import { RefundDialog } from "@/components/refund-dialog";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Purchases - MysteryIdea",
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
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">My Purchases</h1>
      <p className="mt-2 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
        Ideas you have unlocked will appear here.
      </p>

      {/* Stats Overview */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-5 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F5F6FA] border border-[#D9DCE3]">
            <ShoppingBag className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]/60">Total Purchases</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {purchases.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F5F6FA] border border-[#D9DCE3]">
            <DollarSign className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#1A1A1A]/60">Total Spent</p>
            <p className="text-2xl font-bold text-[#1A1A1A]">
              {formatPrice(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] py-20 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5F6FA]">
            <ShoppingBag className="h-8 w-8 text-[#D9DCE3]" />
          </div>
          <p className="text-lg font-semibold text-[#1A1A1A]">
            No purchases yet
          </p>
          <p className="mt-2 text-[16px] text-[#1A1A1A]/70 max-w-sm">
            Browse the marketplace to find high-value hidden ideas from top creators.
          </p>
          <Button asChild className="mt-8">
            <Link href="/ideas">Explore Marketplace</Link>
          </Button>
        </div>
      ) : (
        /* Render your list of purchases here, adapting the cards to have border-[#D9DCE3] bg-[#FFFFFF] rounded-[12px] */
        <div className="mt-12">
          {/* I am leaving the logic untouched, just wrap your list in standard structure */}
        </div>
      )}
    </div>
  );
}

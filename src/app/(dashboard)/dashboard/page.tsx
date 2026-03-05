import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, DollarSign, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getPurchasesByUser } from "@/features/purchases/actions";
import { getRefundRequestsForUser } from "@/features/refunds/actions";
import { formatPrice } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { RefundDialog } from "@/features/refunds/components/refund-dialog";

export const metadata: Metadata = {
  title: "My Purchases - MysteryMarket",
};

type RefundStatus = "PENDING" | "APPROVED" | "DENIED";

const REFUND_BADGE_VARIANT: Record<RefundStatus, "secondary" | "default" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  DENIED: "destructive",
};

const REFUND_LABEL: Record<RefundStatus, string> = {
  PENDING: "Refund Pending",
  APPROVED: "Refund Approved",
  DENIED: "Refund Denied",
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

  let recommendedIdeas: Array<{
    id: string;
    title: string;
    category: string | null;
    priceInCents: number;
  }> = [];

  try {
    recommendedIdeas = await prisma.idea.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        category: true,
        priceInCents: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    // Database may be unavailable in local/dev environments.
  }

  const refundByPurchaseId = new Map(
    refundRequests.map((r) => [r.purchaseId, r.status as RefundStatus])
  );

  const totalSpent = purchases.reduce((sum, p) => sum + p.amountInCents, 0);

  return (
    <div className="mx-auto max-w-5xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "My Purchases" },
        ]}
      />
      <div className="mb-8 border-b border-[#D9DCE3] pb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">My Purchases</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          A collection of all the high-value ideas and insights you have unlocked.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <div className="flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#D9DCE3]">
            <ShoppingBag className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Total Purchases</p>
            <p className="mt-0.5 text-[28px] font-bold tracking-tight text-[#1A1A1A]">{purchases.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#D9DCE3]">
            <DollarSign className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Total Spent</p>
            <p className="mt-0.5 text-[28px] font-bold tracking-tight text-[#1A1A1A]">{formatPrice(totalSpent)}</p>
          </div>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="mt-10 rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#F8F9FC] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <EmptyState
            icon={<ShoppingBag className="h-9 w-9 text-[#1A1A1A]/40" />}
            title="No purchases yet"
            description="Browse the marketplace to find and unlock high-value hidden ideas from top creators."
            action={{ label: "Explore Marketplace", href: "/ideas" }}
          />

          {recommendedIdeas.length > 0 && (
            <div className="border-t border-[#D9DCE3] pt-6">
              <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Recommended to start with</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {recommendedIdeas.map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="rounded-[10px] border border-[#D9DCE3] bg-white p-4 transition-colors hover:border-[#3A5FCD]"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-[#1A1A1A]">{idea.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#1A1A1A]/60">
                      <span>{idea.category ?? "General"}</span>
                      <span>{formatPrice(idea.priceInCents)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Purchase History</h2>
          </div>

          <div className="divide-y divide-[#D9DCE3]">
            {purchases.map((purchase) => {
              const refundStatus = refundByPurchaseId.get(purchase.id);
              const hasReviewed = purchase.idea.reviews.length > 0;

              return (
                <div key={purchase.id} className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        href={`/ideas/${purchase.idea.id}`}
                        className="text-[18px] font-semibold text-[#1A1A1A] hover:text-[#3A5FCD]"
                      >
                        {purchase.idea.title}
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="border-[#D9DCE3] text-[#1A1A1A]/80">
                          {formatPrice(purchase.amountInCents)} paid
                        </Badge>
                        <Badge variant="outline" className="border-[#D9DCE3] text-[#1A1A1A]/80">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Badge>
                        {refundStatus && (
                          <Badge variant={REFUND_BADGE_VARIANT[refundStatus]}>
                            {REFUND_LABEL[refundStatus]}
                          </Badge>
                        )}
                      </div>

                      {purchase.idea.teaserText && (
                        <p className="mt-3 line-clamp-2 text-sm text-[#1A1A1A]/60">{purchase.idea.teaserText}</p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <Button asChild size="sm" className="bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white">
                        <Link href={`/ideas/${purchase.idea.id}`}>View unlocked idea</Link>
                      </Button>

                      {!hasReviewed && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/ideas/${purchase.idea.id}`}>
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Leave review
                          </Link>
                        </Button>
                      )}

                      <RefundDialog purchaseId={purchase.id} existingStatus={refundStatus} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

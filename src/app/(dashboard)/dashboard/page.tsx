import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Calendar,
  MessageSquare,
  PieChart,
  Bookmark,
  Wallet2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { InlineStatCard } from "@/components/shared/stat-card";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { getPurchasesByUser } from "@/features/purchases/actions";
import { getRefundRequestsForUser } from "@/features/refunds/actions";
import { getBookmarks } from "@/features/bookmarks/actions";
import { formatPrice } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { RefundDialog } from "@/features/refunds/components/refund-dialog";

export const metadata: Metadata = {
  title: "Buyer Overview - MysteryMarket",
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

const RECENT_PURCHASES_LIMIT = 5;

export default async function DashboardPage() {
  let purchases: Awaited<ReturnType<typeof getPurchasesByUser>> = [];
  let refundRequests: Awaited<ReturnType<typeof getRefundRequestsForUser>> = [];
  let bookmarkCount = 0;

  try {
    [purchases, refundRequests] = await Promise.all([
      getPurchasesByUser(),
      getRefundRequestsForUser(),
    ]);
  } catch {
    // User not authenticated or not found — show empty state
  }

  try {
    const bookmarks = await getBookmarks();
    bookmarkCount = bookmarks.length;
  } catch {
    // Not authenticated
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
  const recentPurchases = purchases.slice(0, RECENT_PURCHASES_LIMIT);
  const hasMorePurchases = purchases.length > RECENT_PURCHASES_LIMIT;

  return (
    <div className="mx-auto max-w-5xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Buyer Overview" },
        ]}
      />
      <PageHeader
        title="Buyer Overview"
        description="Your purchases, insights, and saved ideas — all in one place."
        action={
          <Button asChild variant="outline">
            <Link href="/ideas">
              <Sparkles className="mr-2 h-4 w-4" />
              Explore Ideas
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <InlineStatCard label="Total Purchases" value={purchases.length} icon={ShoppingBag} />
        <InlineStatCard label="Total Spent" value={formatPrice(totalSpent)} icon={DollarSign} />
      </div>

      {/* Workspace quick links */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/insights"
          className="group flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10">
            <PieChart className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">Buyer Insights</p>
            <p className="text-[12px] text-[#1A1A1A]/50">Spending & analytics</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#1A1A1A]/30 group-hover:text-[#3A5FCD] transition-colors" />
        </Link>

        <Link
          href="/dashboard/bookmarks"
          className="group flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10">
            <Bookmark className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">Saved Ideas</p>
            <p className="text-[12px] text-[#1A1A1A]/50">
              {bookmarkCount > 0 ? `${bookmarkCount} saved` : "Wishlist & bookmarks"}
            </p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#1A1A1A]/30 group-hover:text-[#3A5FCD] transition-colors" />
        </Link>

        <Link
          href="/dashboard/wallet"
          className="group flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10">
            <Wallet2 className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">My Wallet</p>
            <p className="text-[12px] text-[#1A1A1A]/50">Balance & transactions</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#1A1A1A]/30 group-hover:text-[#3A5FCD] transition-colors" />
        </Link>
      </div>

      {/* Recent purchases */}
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
                    className="group rounded-[10px] border border-[#D9DCE3] bg-white p-4 transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">{idea.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#1A1A1A]/60">
                      <span>{idea.category ?? "General"}</span>
                      <span className="font-bold text-[#3A5FCD]">{formatPrice(idea.priceInCents)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <DashboardCard
          title="Recent Purchases"
          bodyClassName="p-0"
          className="mt-10"
          headerClassName="flex items-center justify-between"
        >
          <div className="divide-y divide-[#D9DCE3]">
            {recentPurchases.map((purchase) => {
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

          {hasMorePurchases && (
            <div className="border-t border-[#D9DCE3] px-6 py-4">
              <p className="text-[13px] text-[#1A1A1A]/50">
                Showing {RECENT_PURCHASES_LIMIT} of {purchases.length} purchases.{" "}
                <Link href="/dashboard/insights" className="font-medium text-[#3A5FCD] hover:text-[#6D7BE0]">
                  View full history in Buyer Insights →
                </Link>
              </p>
            </div>
          )}
        </DashboardCard>
      )}
    </div>
  );
}


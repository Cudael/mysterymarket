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
  Compass,
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
  title: "My Library - MysteryMarket",
};

type RefundStatus = "PENDING" | "APPROVED" | "DENIED";

const REFUND_BADGE_VARIANT: Record<
  RefundStatus,
  "secondary" | "default" | "destructive"
> = {
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

const quickLinks = [
  {
    href: "/my/activity",
    title: "Activity",
    description: "Your spending activity and trends",
    icon: PieChart,
  },
  {
    href: "/my/saved",
    title: "Saved Ideas",
    description: "Your curated collection",
    icon: Bookmark,
  },
  {
    href: "/my/wallet",
    title: "Wallet",
    description: "Your balance and transaction history",
    icon: Wallet2,
  },
];

export default async function MyPage() {
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
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "My Library" },
        ]}
      />

      <PageHeader
        title="My Library"
        description="Your purchases, saved ideas, and wallet — everything in one place."
        action={
          <Button asChild variant="outline">
            <Link href="/ideas">
              <Sparkles className="mr-2 h-4 w-4" />
              Explore Ideas
            </Link>
          </Button>
        }
      />

      <DashboardCard bodyClassName="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
            <Compass className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
              Your account at a glance
            </h2>
            <p className="mt-1 text-[14px] leading-6 text-[#1A1A1A]/60">
              Everything you need — recent unlocks, spending insights, saved ideas, and your wallet balance.
            </p>
          </div>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InlineStatCard
          label="Total Purchases"
          value={purchases.length}
          icon={ShoppingBag}
        />
        <InlineStatCard
          label="Total Spent"
          value={formatPrice(totalSpent)}
          icon={DollarSign}
        />
      </div>

      <DashboardCard title="Quick Actions" bodyClassName="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            const helperText =
              item.href === "/my/saved" && bookmarkCount > 0
                ? `${bookmarkCount} saved`
                : item.description;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 transition-all hover:border-[#3A5FCD]/35 hover:bg-[#F8F9FC] hover:shadow-[0_6px_20px_rgba(58,95,205,0.08)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
                  <Icon className="h-5 w-5 text-[#3A5FCD]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#3A5FCD]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-[#1A1A1A]/55">
                    {helperText}
                  </p>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#1A1A1A]/30 transition-colors group-hover:text-[#3A5FCD]" />
              </Link>
            );
          })}
        </div>
      </DashboardCard>

      {purchases.length === 0 ? (
        <DashboardCard bodyClassName="p-0">
          <div className="rounded-[16px] bg-[#F8F9FC] p-2">
            <EmptyState
              icon={<ShoppingBag className="h-9 w-9 text-[#1A1A1A]/40" />}
              title="No purchases yet"
              description="Browse the marketplace to unlock premium ideas from creators across different categories."
              action={{ label: "Explore Marketplace", href: "/ideas" }}
            />
          </div>

          {recommendedIdeas.length > 0 && (
            <div className="border-t border-[#D9DCE3] px-6 py-6">
              <h2 className="text-[14px] font-bold uppercase tracking-[0.08em] text-[#1A1A1A]/45">
                Recommended to start with
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {recommendedIdeas.map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="group rounded-[12px] border border-[#D9DCE3] bg-white p-4 transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#3A5FCD]">
                      {idea.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#1A1A1A]/60">
                      <span>{idea.category ?? "General"}</span>
                      <span className="font-bold text-[#3A5FCD]">
                        {formatPrice(idea.priceInCents)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </DashboardCard>
      ) : (
        <DashboardCard
          title="Recent Purchases"
          bodyClassName="p-0"
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
                        <Badge
                          variant="outline"
                          className="border-[#D9DCE3] text-[#1A1A1A]/80"
                        >
                          {formatPrice(purchase.amountInCents)} paid
                        </Badge>

                        <Badge
                          variant="outline"
                          className="border-[#D9DCE3] text-[#1A1A1A]/80"
                        >
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
                        <p className="mt-3 line-clamp-2 text-sm text-[#1A1A1A]/60">
                          {purchase.idea.teaserText}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <Button asChild size="sm">
                        <Link href={`/ideas/${purchase.idea.id}`}>
                          View unlocked idea
                        </Link>
                      </Button>

                      {!hasReviewed && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/ideas/${purchase.idea.id}`}>
                            <MessageSquare className="mr-1 h-3 w-3" />
                            Leave review
                          </Link>
                        </Button>
                      )}

                      <RefundDialog
                        purchaseId={purchase.id}
                        existingStatus={refundStatus}
                      />
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
                <Link
                  href="/my/activity"
                  className="font-medium text-[#3A5FCD] hover:text-[#6D7BE0]"
                >
                  View more in Activity →
                </Link>
              </p>
            </div>
          )}
        </DashboardCard>
      )}
    </div>
  );
}

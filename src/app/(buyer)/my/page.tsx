import type { Metadata } from "next";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  ShoppingBag,
  DollarSign,
  Calendar,
  MessageSquare,
  Sparkles,
  Bookmark,
  Star,
  ArrowRight,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ContentCard } from "@/components/shared/content-card";
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

export default async function MyPage() {
  const { userId } = await auth();
  const clerkUser = userId ? await currentUser() : null;
  const firstName = clerkUser?.firstName ?? clerkUser?.username ?? null;

  let purchases: Awaited<ReturnType<typeof getPurchasesByUser>> = [];
  let refundRequests: Awaited<ReturnType<typeof getRefundRequestsForUser>> = [];
  let bookmarks: Awaited<ReturnType<typeof getBookmarks>> = [];

  try {
    [purchases, refundRequests, bookmarks] = await Promise.all([
      getPurchasesByUser(),
      getRefundRequestsForUser(),
      getBookmarks(),
    ]);
  } catch {
    // User not authenticated or not found — show empty state
  }

  let recommendedIdeas: Array<{
    id: string;
    title: string;
    category: string | null;
    priceInCents: number;
    teaserText: string | null;
    creator: { name: string | null };
  }> = [];

  try {
    const purchasedIds = purchases.map((p) => p.idea.id);
    recommendedIdeas = await prisma.idea.findMany({
      where: {
        published: true,
        id: purchasedIds.length > 0 ? { notIn: purchasedIds } : undefined,
      },
      select: {
        id: true,
        title: true,
        category: true,
        priceInCents: true,
        teaserText: true,
        creator: { select: { name: true } },
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
  const unbookmarkedCount = bookmarks.filter(
    (b) => !purchases.some((p) => p.idea.id === b.idea.id)
  ).length;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[16px] border border-border bg-card px-6 py-8 sm:px-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Your collection
            </div>
            <h1 className="mt-2 text-[26px] font-bold text-foreground sm:text-[30px]">
              {firstName ? (
                <>Welcome back, {firstName}</>
              ) : (
                <>My Library</>
              )}
            </h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              {purchases.length > 0
                ? `You've unlocked ${purchases.length} ${purchases.length === 1 ? "idea" : "ideas"} — keep exploring.`
                : "Discover and unlock premium ideas from top creators."}
            </p>
          </div>
          <Button asChild>
            <Link href="/ideas">
              <Sparkles className="mr-2 h-4 w-4" />
              Explore Ideas
            </Link>
          </Button>
        </div>

        {/* Subtle background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/20">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
            Unlocked
          </div>
          <p className="text-[22px] font-bold text-foreground">{purchases.length}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/20">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            Total Spent
          </div>
          <p className="text-[22px] font-bold text-foreground">{formatPrice(totalSpent)}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/20">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <Bookmark className="h-3.5 w-3.5 text-primary" />
            Saved
          </div>
          <p className="text-[22px] font-bold text-foreground">{bookmarks.length}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/20">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Avg. Price
          </div>
          <p className="text-[22px] font-bold text-foreground">
            {purchases.length > 0 ? formatPrice(Math.round(totalSpent / purchases.length)) : "—"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/my/activity"
          className="group flex items-center gap-3 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
              Activity
            </p>
            <p className="text-[12px] text-muted-foreground">Spending insights</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-foreground/30 transition-colors group-hover:text-primary" />
        </Link>

        <Link
          href="/my/saved"
          className="group flex items-center gap-3 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
            <Bookmark className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
              Saved Ideas
            </p>
            <p className="text-[12px] text-muted-foreground">
              {unbookmarkedCount > 0 ? `${unbookmarkedCount} not yet unlocked` : "Your shortlist"}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-foreground/30 transition-colors group-hover:text-primary" />
        </Link>

        <Link
          href="/my/reviews"
          className="group flex items-center gap-3 rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
            <Star className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
              My Reviews
            </p>
            <p className="text-[12px] text-muted-foreground">Share your feedback</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-foreground/30 transition-colors group-hover:text-primary" />
        </Link>
      </div>

      {purchases.length === 0 ? (
        <ContentCard bodyClassName="p-0">
          <div className="rounded-[16px] bg-muted p-2">
            <EmptyState
              icon={<ShoppingBag className="h-9 w-9 text-foreground/40" />}
              title="Start your collection"
              description="Discover premium ideas from top creators. Every idea you unlock becomes part of your personal library."
              action={{ label: "Explore Marketplace", href: "/ideas" }}
            />
          </div>

          {recommendedIdeas.length > 0 && (
            <div className="border-t border-border px-6 py-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                  Trending Ideas
                </h2>
                <Link
                  href="/ideas"
                  className="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {recommendedIdeas.map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="group rounded-[12px] border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)]"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {idea.title}
                    </p>
                    {idea.teaserText && (
                      <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">
                        {idea.teaserText}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{idea.category ?? "General"}</span>
                      <span className="font-bold text-primary">
                        {formatPrice(idea.priceInCents)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </ContentCard>
      ) : (
        <>
          <ContentCard
            title="Recent Purchases"
            titleIcon={ShoppingBag}
            bodyClassName="p-0"
            action={
              hasMorePurchases ? (
                <Link
                  href="/my/activity"
                  className="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : undefined
            }
          >
            <div className="divide-y divide-border">
              {recentPurchases.map((purchase) => {
                const refundStatus = refundByPurchaseId.get(purchase.id);
                const hasReviewed = purchase.idea.reviews.length > 0;

                return (
                  <div key={purchase.id} className="p-5 sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <Link
                          href={`/ideas/${purchase.idea.id}`}
                          className="text-[16px] font-semibold text-foreground transition-colors hover:text-primary"
                        >
                          {purchase.idea.title}
                        </Link>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-border text-foreground/80"
                          >
                            {formatPrice(purchase.amountInCents)} paid
                          </Badge>

                          <Badge
                            variant="outline"
                            className="border-border text-foreground/80"
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
                          <p className="mt-2 line-clamp-2 text-[13px] text-muted-foreground">
                            {purchase.idea.teaserText}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button asChild size="sm">
                          <Link href={`/ideas/${purchase.idea.id}`}>
                            Read idea
                          </Link>
                        </Button>

                        {!hasReviewed && (
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/ideas/${purchase.idea.id}`}>
                              <MessageSquare className="mr-1 h-3 w-3" />
                              Review
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
          </ContentCard>

          {/* Recommended Ideas */}
          {recommendedIdeas.length > 0 && (
            <ContentCard
              title="Explore More"
              titleIcon={Sparkles}
              bodyClassName="p-6"
              action={
                <Link
                  href="/ideas"
                  className="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Browse all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {recommendedIdeas.map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.id}`}
                    className="group rounded-[12px] border border-border bg-muted p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)]"
                  >
                    <p className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {idea.title}
                    </p>
                    {idea.teaserText && (
                      <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">
                        {idea.teaserText}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{idea.category ?? "General"}</span>
                      <span className="font-bold text-primary">
                        {formatPrice(idea.priceInCents)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </ContentCard>
          )}
        </>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  Clock,
  DollarSign,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Tag,
  Users,
  BarChart2,
  TrendingUp,
} from "lucide-react";
import { PurchaseTimeline } from "@/features/analytics/components/purchase-timeline";
import { SpendingChart } from "@/features/analytics/components/spending-chart";
import { CategoryBreakdown } from "@/features/analytics/components/category-breakdown";
import { getBuyerAnalytics } from "@/features/analytics/actions";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Activity - MysteryMarket",
};

export default async function ActivityPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analytics = await getBuyerAnalytics();
  const {
    stats,
    spendingByMonth,
    categoryBreakdown,
    purchaseTimeline,
    recommendedIdeas,
  } = analytics;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Activity"
        description="Your purchase history, spending insights, and personalized recommendations."
        icon={<Clock className="h-6 w-6 text-white" />}
      />

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <DollarSign className="h-3.5 w-3.5 text-primary" />
            Total Spent
          </div>
          <p className="text-[22px] font-bold text-foreground">{formatPrice(stats.totalSpent)}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
            Ideas Unlocked
          </div>
          <p className="text-[22px] font-bold text-foreground">{stats.totalPurchases}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <Tag className="h-3.5 w-3.5 text-primary" />
            Categories
          </div>
          <p className="text-[22px] font-bold text-foreground">{stats.uniqueCategories}</p>
        </div>
        <div className="flex flex-col gap-1 rounded-[12px] border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            Creators
          </div>
          <p className="text-[22px] font-bold text-foreground">{stats.uniqueCreators}</p>
        </div>
      </div>

      {/* Spending Chart */}
      <ContentCard
        title="Spending Over Time"
        titleIcon={BarChart2}
        bodyClassName="p-6"
      >
        <p className="mb-4 text-[13px] text-muted-foreground">
          Monthly spend over the last 12 months.
          {stats.averageSpent > 0 && (
            <> Avg. purchase: <span className="font-semibold text-foreground">{formatPrice(stats.averageSpent)}</span></>
          )}
        </p>
        <div className="h-[220px]">
          <SpendingChart data={spendingByMonth} />
        </div>
      </ContentCard>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Category Breakdown */}
        <ContentCard
          title="By Category"
          titleIcon={Tag}
          bodyClassName="p-6"
        >
          {categoryBreakdown.length > 0 ? (
            <>
              {categoryBreakdown[0] && (
                <p className="mb-4 text-[13px] text-muted-foreground">
                  You spend most on{" "}
                  <span className="font-semibold text-foreground">{categoryBreakdown[0].category}</span>{" "}
                  ideas.
                </p>
              )}
              <CategoryBreakdown data={categoryBreakdown} />
            </>
          ) : (
            <p className="py-4 text-[14px] text-muted-foreground">
              No category data yet. Start exploring ideas!
            </p>
          )}
        </ContentCard>

        {/* Growth Insight */}
        <ContentCard
          title="Your Journey"
          titleIcon={TrendingUp}
          bodyClassName="p-6"
        >
          <div className="flex flex-col gap-4">
            {stats.firstPurchaseDate ? (
              <div className="rounded-[10px] border border-border bg-muted p-4">
                <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  Member since
                </p>
                <p className="mt-1 text-[18px] font-bold text-foreground">
                  {new Date(stats.firstPurchaseDate).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            ) : (
              <div className="rounded-[10px] border border-border bg-muted p-4">
                <p className="text-[14px] text-muted-foreground">
                  No purchases yet. Your journey starts with your first unlock!
                </p>
              </div>
            )}

            {stats.totalPurchases > 0 && (
              <div className="rounded-[10px] border border-border bg-muted p-4">
                <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                  Average spend per idea
                </p>
                <p className="mt-1 text-[18px] font-bold text-foreground">
                  {formatPrice(stats.averageSpent)}
                </p>
              </div>
            )}

            <Link
              href="/ideas"
              className="flex items-center justify-center gap-2 rounded-[10px] border border-primary/20 bg-primary/5 p-4 text-[14px] font-medium text-primary transition-all hover:bg-primary/10"
            >
              <Sparkles className="h-4 w-4" />
              Discover new ideas
            </Link>
          </div>
        </ContentCard>
      </div>

      <ContentCard
        title="Purchase History"
        titleIcon={Clock}
        bodyClassName="max-h-[600px] overflow-y-auto p-6"
      >
        <PurchaseTimeline purchases={purchaseTimeline} />
      </ContentCard>

      {recommendedIdeas.length > 0 && (
        <ContentCard
          title="Recommended for You"
          titleIcon={Sparkles}
          action={
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              More to explore <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="group flex flex-col rounded-[12px] border border-border bg-muted p-4 transition-all hover:border-primary/30 hover:shadow-[var(--shadow-primary-glow)]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="line-clamp-2 flex-1 text-[14px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {idea.title}
                  </p>
                  <span className="shrink-0 text-[13px] font-bold text-primary">
                    {formatPrice(idea.priceInCents)}
                  </span>
                </div>

                {idea.teaserText && (
                  <p className="mb-3 line-clamp-2 flex-1 text-[12px] text-muted-foreground">
                    {idea.teaserText}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {idea.unlockType && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                        idea.unlockType === "EXCLUSIVE"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
                    </span>
                  )}

                  {idea.category && (
                    <span className="inline-flex items-center rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {idea.category}
                    </span>
                  )}

                  {idea.purchaseCount > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                      {idea.purchaseCount} unlock{idea.purchaseCount !== 1 ? "s" : ""}
                    </span>
                  )}

                  {idea.creatorName && (
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      by {idea.creatorName}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ContentCard>
      )}
    </div>
  );
}

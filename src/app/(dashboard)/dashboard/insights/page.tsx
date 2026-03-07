import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  PieChart,
  DollarSign,
  ShoppingBag,
  Tag,
  Users,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SpendingChart } from "@/features/analytics/components/spending-chart";
import { CategoryBreakdown } from "@/features/analytics/components/category-breakdown";
import { PurchaseTimeline } from "@/features/analytics/components/purchase-timeline";
import { getBuyerAnalytics } from "@/features/analytics/actions";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buyer Insights - MysteryMarket",
};

export default async function BuyerInsightsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const analytics = await getBuyerAnalytics();
  const { stats, spendingByMonth, categoryBreakdown, purchaseTimeline, recommendedIdeas } = analytics;

  const memberSince = stats.firstPurchaseDate
    ? new Date(stats.firstPurchaseDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Buyer Overview", href: "/dashboard" },
          { label: "Buyer Insights" },
        ]}
      />
      <PageHeader
        title="Buyer Insights"
        description="Track your spending patterns and discover new ideas."
        icon={<PieChart className="h-6 w-6 text-[#FFFFFF]" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total Spent", value: formatPrice(stats.totalSpent), sub: "All time", icon: DollarSign },
          { label: "Total Purchases", value: stats.totalPurchases, sub: "Completed", icon: ShoppingBag },
          { label: "Categories", value: stats.uniqueCategories, sub: "Unique", icon: Tag },
          { label: "Creators", value: stats.uniqueCreators, sub: "Bought from", icon: Users },
          { label: "Avg Per Idea", value: formatPrice(stats.averageSpent), sub: "Per purchase", icon: TrendingUp },
          { label: "Member Since", value: memberSince, sub: "First purchase", icon: Calendar },
        ].map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            subLabel={stat.sub}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Spending Chart */}
      <DashboardCard title="Spending Over Time" bodyClassName="p-6">
        <div className="h-[300px]">
          <SpendingChart data={spendingByMonth} />
        </div>
      </DashboardCard>

      {/* Category Breakdown + Purchase Timeline */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Spending by Category" bodyClassName="p-6 flex-1">
          <CategoryBreakdown data={categoryBreakdown} />
        </DashboardCard>

        <DashboardCard title="Recent Purchases" bodyClassName="p-6 flex-1 overflow-y-auto max-h-[500px]">
          <PurchaseTimeline purchases={purchaseTimeline} />
        </DashboardCard>
      </div>

      {/* Recommended Ideas */}
      {recommendedIdeas.length > 0 && (
        <DashboardCard
          title="Recommended for You"
          titleIcon={Sparkles}
          action={
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3A5FCD] hover:text-[#6D7BE0] transition-colors"
            >
              Explore all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <p className="text-[13px] text-[#1A1A1A]/50 mb-4">
            Based on your purchase history and interests
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="group rounded-[10px] border border-[#D9DCE3] bg-[#F8F9FC] p-4 transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)] flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors line-clamp-2 flex-1">
                    {idea.title}
                  </p>
                  <span className="shrink-0 text-[13px] font-bold text-[#3A5FCD]">
                    {formatPrice(idea.priceInCents)}
                  </span>
                </div>
                {idea.teaserText && (
                  <p className="text-[12px] text-[#1A1A1A]/50 line-clamp-2 mb-3 flex-1">
                    {idea.teaserText}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-auto flex-wrap">
                  {idea.unlockType && (
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                      idea.unlockType === "EXCLUSIVE"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-[#D9DCE3] bg-[#FFFFFF] text-[#1A1A1A]/60"
                    }`}>
                      {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
                    </span>
                  )}
                  {idea.category && (
                    <span className="inline-flex items-center rounded-full border border-[#D9DCE3] bg-[#FFFFFF] px-2 py-0.5 text-[11px] font-medium text-[#1A1A1A]/60">
                      {idea.category}
                    </span>
                  )}
                  {idea.purchaseCount > 0 && (
                    <span className="text-[11px] text-[#1A1A1A]/40">
                      {idea.purchaseCount} unlock{idea.purchaseCount !== 1 ? "s" : ""}
                    </span>
                  )}
                  {idea.creatorName && (
                    <span className="text-[11px] text-[#1A1A1A]/40 ml-auto">
                      by {idea.creatorName}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </DashboardCard>
      )}

    </div>
  );
}

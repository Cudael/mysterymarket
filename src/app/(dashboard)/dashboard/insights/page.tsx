import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Insights - MysteryMarket",
};

export default async function BuyerInsightsPage() {
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

  const memberSince = stats.firstPurchaseDate
    ? new Date(stats.firstPurchaseDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "—";

  const statsConfig = [
    {
      label: "Total Spent",
      value: formatPrice(stats.totalSpent),
      sub: "Lifetime purchases",
      icon: DollarSign,
    },
    {
      label: "Purchases",
      value: stats.totalPurchases,
      sub: "Completed unlocks",
      icon: ShoppingBag,
    },
    {
      label: "Categories",
      value: stats.uniqueCategories,
      sub: "Explored so far",
      icon: Tag,
    },
    {
      label: "Creators",
      value: stats.uniqueCreators,
      sub: "Bought from",
      icon: Users,
    },
    {
      label: "Average Spend",
      value: formatPrice(stats.averageSpent),
      sub: "Per purchase",
      icon: TrendingUp,
    },
    {
      label: "Member Since",
      value: memberSince,
      sub: "First purchase",
      icon: Calendar,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Insights" },
        ]}
      />

      <PageHeader
        title="Insights"
        description="Understand your spending patterns, purchase habits, and where your interests are trending."
        icon={<PieChart className="h-6 w-6 text-white" />}
      />

      <DashboardCard bodyClassName="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
            <TrendingUp className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
              Buying activity snapshot
            </h2>
            <p className="mt-1 text-[14px] leading-6 text-[#1A1A1A]/60">
              Use these metrics to see how much you’ve spent, which categories you
              gravitate toward, and what kinds of ideas might be worth exploring next.
            </p>
          </div>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {statsConfig.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            subLabel={stat.sub}
            icon={stat.icon}
          />
        ))}
      </div>

      <DashboardCard title="Spending Over Time" bodyClassName="p-6">
        <p className="mb-4 text-[13px] text-[#1A1A1A]/55">
          Track how your spending changes month to month.
        </p>
        <div className="h-[320px]">
          <SpendingChart data={spendingByMonth} />
        </div>
      </DashboardCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard title="Spending by Category" bodyClassName="p-6">
          <CategoryBreakdown data={categoryBreakdown} />
        </DashboardCard>

        <DashboardCard
          title="Recent Purchases"
          bodyClassName="max-h-[500px] overflow-y-auto p-6"
        >
          <PurchaseTimeline purchases={purchaseTimeline} />
        </DashboardCard>
      </div>

      {recommendedIdeas.length > 0 && (
        <DashboardCard
          title="Recommended for You"
          titleIcon={Sparkles}
          action={
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3A5FCD] transition-colors hover:text-[#6D7BE0]"
            >
              Explore all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-6"
        >
          <p className="mb-4 text-[13px] text-[#1A1A1A]/55">
            Based on your purchases and browsing interests.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="group flex flex-col rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-4 transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="line-clamp-2 flex-1 text-[14px] font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#3A5FCD]">
                    {idea.title}
                  </p>
                  <span className="shrink-0 text-[13px] font-bold text-[#3A5FCD]">
                    {formatPrice(idea.priceInCents)}
                  </span>
                </div>

                {idea.teaserText && (
                  <p className="mb-3 line-clamp-2 flex-1 text-[12px] text-[#1A1A1A]/50">
                    {idea.teaserText}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {idea.unlockType && (
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                        idea.unlockType === "EXCLUSIVE"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-[#D9DCE3] bg-[#FFFFFF] text-[#1A1A1A]/60"
                      }`}
                    >
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
                    <span className="ml-auto text-[11px] text-[#1A1A1A]/40">
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

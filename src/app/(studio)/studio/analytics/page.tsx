import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  BarChart3,
  Star,
  DollarSign,
  ShoppingCart,
  Lightbulb,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { RevenueChart } from "@/features/analytics/components/revenue-chart";
import { TopIdeasTable } from "@/features/analytics/components/top-ideas-table";
import { RecentSales } from "@/features/analytics/components/recent-sales";
import { PayoutInfo } from "@/features/analytics/components/payout-info";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ContentCard } from "@/components/shared/content-card";
import { getCreatorAnalytics } from "@/features/analytics/actions";
import { getConnectAccountStatus } from "@/features/stripe/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics - MysteryMarket",
};

export default async function StudioAnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [analytics, connectStatus] = await Promise.all([
    getCreatorAnalytics(),
    getConnectAccountStatus(),
  ]);

  const { stats, revenueByMonth, topIdeas, recentSales } = analytics;

  const statsConfig = [
    {
      label: "Net Revenue",
      value: formatPrice(stats.totalRevenue),
      sub: "After platform fees",
      icon: DollarSign,
    },
    {
      label: "Sales",
      value: stats.totalSales,
      sub: "Completed purchases",
      icon: ShoppingCart,
    },
    {
      label: "Average Rating",
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—",
      sub: "Out of 5.0",
      icon: Star,
    },
    {
      label: "Reviews",
      value: stats.totalReviews,
      sub: "Buyer feedback",
      icon: MessageSquare,
    },
    {
      label: "Published Ideas",
      value: stats.activeIdeas,
      sub: "Currently active",
      icon: Lightbulb,
    },
    {
      label: "Total Ideas",
      value: stats.totalIdeas,
      sub: "All time",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Analytics"
        description="Review revenue trends, buyer feedback, and how your ideas are performing over time."
        icon={<BarChart3 className="h-6 w-6 text-white" />}
      />

      <ContentCard bodyClassName="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
            <TrendingUp className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold text-[#1A1A1A]">
              Performance snapshot
            </h2>
            <p className="mt-1 text-[14px] leading-6 text-[#1A1A1A]/60">
              Use these metrics to identify which ideas are converting, whether
              your revenue is growing, and if your payout setup needs attention.
            </p>
          </div>
        </div>
      </ContentCard>

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

      <ContentCard title="Revenue Over Time" bodyClassName="p-6">
        <div className="mb-4">
          <p className="text-[13px] text-[#1A1A1A]/55">
            Track monthly earnings to spot momentum and seasonality.
          </p>
        </div>
        <div className="h-[320px]">
          <RevenueChart data={revenueByMonth} />
        </div>
      </ContentCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentCard title="Top Performing Ideas" bodyClassName="p-0 sm:p-6">
          <TopIdeasTable ideas={topIdeas} />
        </ContentCard>

        <ContentCard title="Recent Sales" bodyClassName="p-0 sm:p-6">
          <RecentSales sales={recentSales} />
        </ContentCard>
      </div>

      <ContentCard title="Payout Settings" bodyClassName="p-6">
        <PayoutInfo
          connected={connectStatus.connected}
          onboarded={connectStatus.onboarded}
        />
      </ContentCard>
    </div>
  );
}

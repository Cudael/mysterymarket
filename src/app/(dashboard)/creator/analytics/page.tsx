import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BarChart3, Star, DollarSign, ShoppingCart, Lightbulb, MessageSquare } from "lucide-react";
import { RevenueChart } from "@/features/analytics/components/revenue-chart";
import { TopIdeasTable } from "@/features/analytics/components/top-ideas-table";
import { RecentSales } from "@/features/analytics/components/recent-sales";
import { PayoutInfo } from "@/features/analytics/components/payout-info";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { getCreatorAnalytics } from "@/features/analytics/actions";
import { getConnectAccountStatus } from "@/features/stripe/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics - MysteryMarket",
};

export default async function CreatorAnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [analytics, connectStatus] = await Promise.all([
    getCreatorAnalytics(),
    getConnectAccountStatus(),
  ]);

  const { stats, revenueByMonth, topIdeas, recentSales } = analytics;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Creator", href: "/creator" },
          { label: "Analytics" },
        ]}
      />
      <PageHeader
        title="Creator Analytics"
        description="Your overall performance and revenue at a glance."
        icon={<BarChart3 className="h-6 w-6 text-[#FFFFFF]" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total Revenue", value: formatPrice(stats.totalRevenue), sub: "Net earnings", icon: DollarSign },
          { label: "Total Sales", value: stats.totalSales, sub: "Purchases", icon: ShoppingCart },
          { label: "Avg Rating", value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—", sub: "Out of 5.0", icon: Star },
          { label: "Total Reviews", value: stats.totalReviews, sub: "Engagement", icon: MessageSquare },
          { label: "Active Ideas", value: stats.activeIdeas, sub: "Published", icon: Lightbulb },
          { label: "Total Ideas", value: stats.totalIdeas, sub: "All time", icon: Lightbulb },
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

      {/* Revenue Chart Wrapper */}
      <DashboardCard title="Revenue Over Time" bodyClassName="p-6">
        <div className="h-[300px]">
          <RevenueChart data={revenueByMonth} />
        </div>
      </DashboardCard>

      {/* Top Ideas + Recent Sales */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Top Performing Ideas" bodyClassName="p-0 sm:p-6 flex-1">
          <TopIdeasTable ideas={topIdeas} />
        </DashboardCard>

        <DashboardCard title="Recent Sales" bodyClassName="p-0 sm:p-6 flex-1">
          <RecentSales sales={recentSales} />
        </DashboardCard>
      </div>

      {/* Payout Info Wrapper */}
      <DashboardCard title="Payout Settings">
        <PayoutInfo
          connected={connectStatus.connected}
          onboarded={connectStatus.onboarded}
        />
      </DashboardCard>
      
    </div>
  );
}

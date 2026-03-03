import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BarChart3, Star, DollarSign, ShoppingCart, Lightbulb, MessageSquare } from "lucide-react";
import { RevenueChart } from "@/features/analytics/components/revenue-chart";
import { TopIdeasTable } from "@/features/analytics/components/top-ideas-table";
import { RecentSales } from "@/features/analytics/components/recent-sales";
import { PayoutInfo } from "@/features/analytics/components/payout-info";
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
      
      {/* Header */}
      <div className="flex items-center gap-3.5 border-b border-[#D9DCE3] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#3A5FCD] shadow-[0_2px_8px_rgba(58,95,205,0.3)]">
          <BarChart3 className="h-6 w-6 text-[#FFFFFF]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Creator Analytics</h1>
          <p className="text-[15px] text-[#1A1A1A]/60">Your overall performance and revenue at a glance.</p>
        </div>
      </div>

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
          <div key={i} className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A]/50 mt-0.5">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-[#1A1A1A]/70" />
            </div>
            <div className="mt-5">
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#1A1A1A]/40">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart Wrapper */}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
        <h2 className="text-[16px] font-semibold text-[#1A1A1A] mb-6">Revenue Over Time</h2>
        <div className="h-[300px]">
          <RevenueChart data={revenueByMonth} />
        </div>
      </div>

      {/* Top Ideas + Recent Sales */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Top Performing Ideas</h2>
          </div>
          <div className="p-0 sm:p-6 flex-1">
            <TopIdeasTable ideas={topIdeas} />
          </div>
        </div>

        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Recent Sales</h2>
          </div>
          <div className="p-0 sm:p-6 flex-1">
            <RecentSales sales={recentSales} />
          </div>
        </div>
      </div>

      {/* Payout Info Wrapper */}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Payout Settings</h2>
        </div>
        <div className="p-6">
          <PayoutInfo
            connected={connectStatus.connected}
            onboarded={connectStatus.onboarded}
          />
        </div>
      </div>
      
    </div>
  );
}

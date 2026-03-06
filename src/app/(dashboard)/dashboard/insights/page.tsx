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

      {/* Header */}
      <div className="flex items-center gap-3.5 border-b border-[#D9DCE3] pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#3A5FCD] shadow-[0_2px_8px_rgba(58,95,205,0.3)]">
          <PieChart className="h-6 w-6 text-[#FFFFFF]" />
        </div>
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Buyer Insights</h1>
          <p className="text-[15px] text-[#1A1A1A]/60">Track your spending patterns and discover new ideas.</p>
        </div>
      </div>

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

      {/* Spending Chart */}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
        <h2 className="text-[16px] font-semibold text-[#1A1A1A] mb-6">Spending Over Time</h2>
        <div className="h-[300px]">
          <SpendingChart data={spendingByMonth} />
        </div>
      </div>

      {/* Category Breakdown + Purchase Timeline */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Spending by Category</h2>
          </div>
          <div className="p-6 flex-1">
            <CategoryBreakdown data={categoryBreakdown} />
          </div>
        </div>

        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Recent Purchases</h2>
          </div>
          <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
            <PurchaseTimeline purchases={purchaseTimeline} />
          </div>
        </div>
      </div>

      {/* Recommended Ideas */}
      {recommendedIdeas.length > 0 && (
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#3A5FCD]" />
              <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Recommended for You</h2>
            </div>
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3A5FCD] hover:text-[#6D7BE0] transition-colors"
            >
              Explore all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-6">
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
          </div>
        </div>
      )}

    </div>
  );
}

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
} from "lucide-react";
import { PurchaseTimeline } from "@/features/analytics/components/purchase-timeline";
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
    purchaseTimeline,
    recommendedIdeas,
  } = analytics;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Activity"
        description="Your purchase history and unlocked ideas, all in one place."
        icon={<Clock className="h-6 w-6 text-white" />}
      />

      {/* Inline key stats */}
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2.5 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] px-5 py-3.5">
          <DollarSign className="h-4 w-4 text-[#3A5FCD]" />
          <span className="text-[13px] text-[#1A1A1A]/60">Total spent</span>
          <span className="text-[15px] font-bold text-[#1A1A1A]">{formatPrice(stats.totalSpent)}</span>
        </div>
        <div className="flex items-center gap-2.5 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] px-5 py-3.5">
          <ShoppingBag className="h-4 w-4 text-[#3A5FCD]" />
          <span className="text-[13px] text-[#1A1A1A]/60">Ideas unlocked</span>
          <span className="text-[15px] font-bold text-[#1A1A1A]">{stats.totalPurchases}</span>
        </div>
      </div>

      <ContentCard
        title="Recent purchases"
        bodyClassName="max-h-[600px] overflow-y-auto p-6"
      >
        <PurchaseTimeline purchases={purchaseTimeline} />
      </ContentCard>

      {recommendedIdeas.length > 0 && (
        <ContentCard
          title="Ideas you might like"
          titleIcon={Sparkles}
          action={
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-[13px] font-medium text-[#3A5FCD] transition-colors hover:text-[#6D7BE0]"
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
        </ContentCard>
      )}
    </div>
  );
}

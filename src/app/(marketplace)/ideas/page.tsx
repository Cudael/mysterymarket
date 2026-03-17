import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { CategoryPickerGrid } from "@/components/marketplace/category-picker-grid";
import { Pagination } from "@/components/shared/pagination";
import {
  buildMarketplaceWhere,
  getBookmarkedIdeaIds,
  getIdeaRatings,
  getMarketplaceIdeas,
  normalizeMarketplaceSearchParams,
  resolveSubcategory,
} from "@/features/ideas/lib/marketplace-data";
import { getRisingIdeas } from "@/features/ideas/lib/discovery";

export const metadata: Metadata = {
  title: "Explore Ideas - MysteryMarket",
  description: "Browse and unlock premium ideas from top creators.",
};

interface IdeasPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    unlockType?: string;
    subcategory?: string;
    maturity?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function IdeasPage({ searchParams }: IdeasPageProps) {
  const params = await searchParams;
  const { userId: clerkId } = await auth();
  const filters = normalizeMarketplaceSearchParams(params);
  const resolvedSubcategory = await resolveSubcategory(filters.subcategory);
  const activeSubcategory =
    resolvedSubcategory &&
    (!filters.category || resolvedSubcategory.category.name === filters.category)
      ? resolvedSubcategory
      : null;
  const where = buildMarketplaceWhere({
    filters,
    categoryName: filters.category || undefined,
    resolvedSubcategory: activeSubcategory,
  });

  const [listing, bookmarkedIdeaIds, risingIdeas] = await Promise.all([
    getMarketplaceIdeas({ filters, where }),
    getBookmarkedIdeaIds(clerkId),
    getRisingIdeas({ take: 4, category: filters.category || undefined }),
  ]);

  const ratingMap = await getIdeaRatings([
    ...new Set([...listing.ideas.map((idea) => idea.id), ...risingIdeas.map((idea) => idea.id)]),
  ]);
  const trendingIds = new Set(
    [...listing.ideas]
      .sort((a, b) => b._count.purchases - a._count.purchases)
      .filter((idea) => idea._count.purchases > 0)
      .slice(0, 3)
      .map((idea) => idea.id)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-[hsl(252,32%,4%)]">
        {/* Atmospheric glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_-5%_50%,rgba(109,90,230,0.22),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_20%,rgba(232,194,106,0.07),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 dot-grid-sm" />
        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-background" />

        <div className="container relative mx-auto max-w-[1400px] px-6 pb-12 pt-12 lg:px-8 lg:pb-16 lg:pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
            Marketplace
          </p>
          <h1 className="mt-3 text-[34px] font-extrabold tracking-[-0.045em] text-white sm:text-[46px]">
            Discover hidden ideas
          </h1>
          <p className="mt-3 max-w-lg text-[16px] leading-[1.75] text-white/50">
            Premium concepts from top creators — every idea stays locked until you unlock it.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
        {/* Category picker — shown when no search is active */}
        {!filters.search && (
          <div className="mb-8">
            <CategoryPickerGrid />
          </div>
        )}

        <Suspense
          fallback={<div className="h-[44px] animate-pulse rounded-full bg-white/[0.04]" />}
        >
          <IdeaFilters
            total={listing.total}
          />
        </Suspense>

        <section id="marketplace-results" className="scroll-mt-20 pb-16 pt-8">
          {risingIdeas.length > 0 && !filters.search && filters.page === 1 && (
            <div className="mb-8 rounded-2xl border border-white/[0.08] bg-[hsl(252,28%,6%)] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/70">
                    Rising now
                  </p>
                  <h2 className="mt-2 text-[20px] font-bold tracking-[-0.03em] text-white/85">
                    Fresh ideas getting real unlock momentum
                  </h2>
                  <p className="mt-1 text-[13px] text-white/40">
                    Ranked with a lightweight mix of recency, unlocks, and reviews.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {risingIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    id={idea.id}
                    title={idea.title}
                    teaserText={idea.teaserText}
                    teaserImageUrl={idea.teaserImageUrl}
                    priceInCents={idea.priceInCents}
                    unlockType={idea.unlockType}
                    category={idea.category}
                    maturityLevel={idea.maturityLevel}
                    creatorId={idea.creator.id}
                    creatorName={idea.creator.name}
                    creatorAvatarUrl={idea.creator.avatarUrl}
                    isCreatorVerified={idea.creator.stripeOnboarded}
                    purchaseCount={idea._count.purchases}
                    reviewCount={idea._count.reviews}
                    averageRating={ratingMap.get(idea.id)}
                    tags={idea.tags}
                    initialBookmarked={bookmarkedIdeaIds.has(idea.id)}
                    isAuthenticated={!!clerkId}
                    isTrending
                    maxUnlocks={idea.maxUnlocks}
                  />
                ))}
              </div>
            </div>
          )}

          {listing.ideas.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-[hsl(252,28%,6%)] px-6 py-20 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03]">
                <Lightbulb className="h-7 w-7 text-primary/30" />
              </div>
              <p className="text-[22px] font-bold tracking-[-0.03em] text-white/80">
                No mysteries match this exact trail yet
              </p>
              <p className="mt-3 max-w-lg text-[15px] leading-7 text-white/40">
                Try a broader category, clear a few filters, or switch to a different
                collection to see what creators are hiding there.
              </p>
              <Button asChild className="mt-6 rounded-full px-6 bg-primary text-primary-foreground shadow-[var(--shadow-primary-glow)]">
                <Link href="/ideas">Reset marketplace</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Result count */}
              <p className="mb-5 text-[13px] text-white/30">
                {listing.total} {listing.total === 1 ? "idea" : "ideas"} found
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listing.ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    id={idea.id}
                    title={idea.title}
                    teaserText={idea.teaserText}
                    teaserImageUrl={idea.teaserImageUrl}
                    priceInCents={idea.priceInCents}
                    unlockType={idea.unlockType}
                    category={idea.category}
                    subcategoryName={idea.subcategory?.name}
                    maturityLevel={idea.maturityLevel}
                    creatorId={idea.creator.id}
                    creatorName={idea.creator.name}
                    creatorAvatarUrl={idea.creator.avatarUrl}
                    isCreatorVerified={idea.creator.stripeOnboarded}
                    purchaseCount={idea._count.purchases}
                    reviewCount={idea._count.reviews}
                    averageRating={ratingMap.get(idea.id)}
                    tags={idea.tags}
                    initialBookmarked={bookmarkedIdeaIds.has(idea.id)}
                    isAuthenticated={!!clerkId}
                    isTrending={trendingIds.has(idea.id)}
                    maxUnlocks={idea.maxUnlocks}
                  />
                ))}
              </div>

              {listing.totalPages > 1 && (
                <div className="mt-12 flex justify-center border-t border-white/[0.06] pt-8">
                  <Suspense fallback={null}>
                    <Pagination
                      currentPage={filters.page}
                      totalPages={listing.totalPages}
                      basePath="/ideas"
                    />
                  </Suspense>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

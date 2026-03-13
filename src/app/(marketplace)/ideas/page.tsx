import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { Pagination } from "@/components/shared/pagination";
import {
  buildMarketplaceWhere,
  getBookmarkedIdeaIds,
  getIdeaRatings,
  getMarketplaceIdeas,
  normalizeMarketplaceSearchParams,
  resolveSubcategory,
} from "@/features/ideas/lib/marketplace-data";
import { getCategorySlugFromName } from "@/features/ideas/lib/marketplace-filters";

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

  const [listing, bookmarkedIdeaIds] = await Promise.all([
    getMarketplaceIdeas({ filters, where }),
    getBookmarkedIdeaIds(clerkId),
  ]);

  const ratingMap = await getIdeaRatings(listing.ideas.map((idea) => idea.id));
  const trendingIds = new Set(
    [...listing.ideas]
      .sort((a, b) => b._count.purchases - a._count.purchases)
      .filter((idea) => idea._count.purchases > 0)
      .slice(0, 3)
      .map((idea) => idea.id)
  );
  const activeCategorySlug = getCategorySlugFromName(filters.category);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <div className="container mx-auto max-w-[1400px] px-6 py-10 lg:px-8">
        <div className="mb-8 rounded-[24px] bg-[hsl(252,40%,6%)] px-8 py-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Marketplace</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight sm:text-[36px]">
            Discover hidden ideas
          </h1>
          <p className="mt-2 text-[15px] text-white/65 max-w-xl">
            Browse premium concepts from top creators. Every idea stays locked until you unlock it.
          </p>
        </div>
        <Suspense
          fallback={<div className="h-[72px] animate-pulse rounded-[30px] bg-border/40" />}
        >
          <IdeaFilters
            total={listing.total}
            activeCategorySlug={activeCategorySlug}
            activeCategoryName={filters.category || undefined}
          />
        </Suspense>

        <section id="marketplace-results" className="scroll-mt-20 pb-16 pt-8">
          {listing.ideas.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-card/95 px-6 py-20 text-center shadow-sm">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
                <Lightbulb className="h-7 w-7 text-primary/40" />
              </div>
              <p className="text-[22px] font-semibold tracking-[-0.03em] text-foreground">
                No mysteries match this exact trail yet
              </p>
              <p className="mt-3 max-w-lg text-[15px] leading-7 text-muted-foreground">
                Try a broader category, clear a few filters, or switch to a different
                collection to see what creators are hiding there.
              </p>
              <Button asChild className="mt-6 rounded-full px-6">
                <Link href="/ideas">Reset marketplace</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                    purchaseCount={idea._count.purchases}
                    reviewCount={idea._count.reviews}
                    averageRating={ratingMap.get(idea.id)}
                    tags={idea.tags}
                    initialBookmarked={bookmarkedIdeaIds.has(idea.id)}
                    isAuthenticated={!!clerkId}
                    isTrending={trendingIds.has(idea.id)}
                  />
                ))}
              </div>

              {listing.totalPages > 1 && (
                <div className="mt-12 flex justify-center border-t border-border pt-8">
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

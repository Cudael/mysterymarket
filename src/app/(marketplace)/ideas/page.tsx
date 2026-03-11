import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  Compass,
  LockKeyhole,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { Pagination } from "@/components/shared/pagination";
import { Lightbulb } from "lucide-react";
import prisma from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/categories";
import { formatPrice } from "@/lib/utils";
import {
  buildMarketplaceWhere,
  getBookmarkedIdeaIds,
  getIdeaRatings,
  getMarketplaceIdeas,
  getTopCategoryCounts,
  normalizeMarketplaceSearchParams,
  resolveSubcategory,
} from "@/features/ideas/lib/marketplace-data";
import { getCategorySlugFromName, getSortLabel } from "@/features/ideas/lib/marketplace-filters";

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

  const [
    listing,
    bookmarkedIdeaIds,
    topCategories,
    totalIdeas,
    exclusiveIdeas,
    creatorRows,
    averagePrice,
  ] = await Promise.all([
    getMarketplaceIdeas({ filters, where }),
    getBookmarkedIdeaIds(clerkId),
    getTopCategoryCounts(6),
    prisma.idea.count({ where: { published: true } }),
    prisma.idea.count({ where: { published: true, unlockType: "EXCLUSIVE" } }),
    prisma.idea.findMany({
      where: { published: true },
      select: { creatorId: true },
      distinct: ["creatorId"],
    }),
    prisma.idea.aggregate({
      where: { published: true },
      _avg: { priceInCents: true },
    }),
  ]);

  const ratingMap = await getIdeaRatings(listing.ideas.map((idea) => idea.id));
  const trendingIds = new Set(
    [...listing.ideas]
      .sort((a, b) => b._count.purchases - a._count.purchases)
      .filter((idea) => idea._count.purchases > 0)
      .slice(0, 3)
      .map((idea) => idea.id)
  );
  const averagePriceLabel =
    typeof averagePrice._avg.priceInCents === "number"
      ? formatPrice(Math.round(averagePrice._avg.priceInCents))
      : "N/A";
  const activeCategorySlug = getCategorySlugFromName(filters.category);
  const discoveryPoints = [
    {
      icon: LockKeyhole,
      title: "Protected previews",
      body: "Cards reveal enough to judge the spark while keeping the execution safely hidden.",
    },
    {
      icon: TrendingUp,
      title: "Signal-rich browsing",
      body: "Sort by fresh arrivals, best-rated ideas, or the concepts buyers are unlocking fastest.",
    },
    {
      icon: Compass,
      title: "Curated collections",
      body: "Move from broad themes into narrower subcategories when you want a sharper vein of ideas.",
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98)_0%,_rgba(241,245,249,0.92)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_32%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.16),_transparent_24%)]" />

        <div className="container mx-auto max-w-[1400px] px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Hidden ideas marketplace
              </div>

              <h1 className="mt-5 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-[52px]">
                Buy the spark before the rest of the market sees the fire.
              </h1>
              <p className="mt-5 max-w-2xl text-[17px] leading-8 text-muted-foreground">
                MysteryMarket is built for curiosity-first discovery. You browse protected
                previews, judge the signal, and unlock the full idea only when you are ready
                to claim the edge.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-6">
                  <Link href="#marketplace-results">
                    Browse mysteries
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-border bg-background/80 px-6">
                  <Link href="/studio">Start selling ideas</Link>
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-border/70 bg-card/90 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Live ideas
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
                    {totalIdeas}
                  </p>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-card/90 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Active creators
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
                    {creatorRows.length}
                  </p>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-card/90 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Exclusive drops
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
                    {exclusiveIdeas}
                  </p>
                </div>
                <div className="rounded-[22px] border border-border/70 bg-card/90 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Average unlock
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
                    {averagePriceLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-border/70 bg-card/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    How it feels
                  </p>
                  <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-foreground">
                    Designed for curiosity, not commodity browsing
                  </h2>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary sm:flex">
                  <LockKeyhole className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {discoveryPoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.title}
                      className="rounded-[24px] border border-border/70 bg-background/80 p-5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-foreground">
                            {point.title}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {point.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,_rgba(15,23,42,0.96)_0%,_rgba(67,56,202,0.92)_100%)] p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Right now
                </p>
                <p className="mt-3 text-lg font-semibold">
                  {listing.total} mystery {listing.total === 1 ? "idea matches" : "ideas match"}
                  {filters.search ? ` "${filters.search}"` : " your view"}.
                </p>
                <p className="mt-2 text-sm leading-7 text-white/75">
                  Sorted by {getSortLabel(filters.sortBy).toLowerCase()}
                  {activeSubcategory ? ` within ${activeSubcategory.name}` : ""}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="-mt-8">
          <Suspense
            fallback={<div className="h-[280px] animate-pulse rounded-[30px] bg-border/40" />}
          >
            <IdeaFilters
              total={listing.total}
              activeCategorySlug={activeCategorySlug}
              activeCategoryName={filters.category || undefined}
            />
          </Suspense>
        </div>

        <section className="py-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Curated collections
              </p>
              <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-foreground">
                Start from a realm that matches your curiosity
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                These collections pull you into specific parts of the marketplace without
                flattening the mystery. Choose a direction, then follow the signal.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {topCategories.map((category) => {
              const Icon = getCategoryIcon(category.icon);

              return (
                <Link
                  key={category.slug}
                  href={`/ideas/category/${category.slug}`}
                  className="group rounded-[28px] border border-border/70 bg-card/95 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_16px_36px_rgba(99,102,241,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                      {category.count} live
                    </div>
                  </div>
                  <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-foreground">
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore collection
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="marketplace-results" className="pb-16 pt-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Marketplace results
              </p>
              <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-foreground">
                The latest mysteries worth unlocking
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                Browse protected previews, compare signal, and choose which idea deserves your unlock.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[12px] font-medium text-primary">
                  Search: {filters.search}
                </span>
              )}
              {activeSubcategory && (
                <span className="rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground">
                  Lane: {activeSubcategory.name}
                </span>
              )}
            </div>
          </div>

          {listing.ideas.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-card/95 px-6 py-20 text-center shadow-sm">
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
              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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

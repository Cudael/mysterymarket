import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  Compass,
  Lightbulb,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { Pagination } from "@/components/shared/pagination";
import { CATEGORY_META, getCategoryBySlug } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getCategoryIcon } from "@/lib/categories";
import { formatPrice } from "@/lib/utils";
import {
  buildMarketplaceWhere,
  getBookmarkedIdeaIds,
  getIdeaRatings,
  getMarketplaceIdeas,
  getSubcategoryIdeaCounts,
  normalizeMarketplaceSearchParams,
  resolveSubcategory,
} from "@/features/ideas/lib/marketplace-data";
import { getSortLabel } from "@/features/ideas/lib/marketplace-filters";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    search?: string;
    unlockType?: string;
    subcategory?: string;
    maturity?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not Found" };

  return {
    title: `${category.name} Ideas - MysteryMarket`,
    description: category.description,
  };
}

export function generateStaticParams() {
  return Object.values(CATEGORY_META).map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const sp = await searchParams;
  const { userId: clerkId } = await auth();
  const filters = normalizeMarketplaceSearchParams(sp);
  const resolvedSubcategory = await resolveSubcategory(filters.subcategory);
  const activeSubcategory =
    resolvedSubcategory?.category.name === category.name ? resolvedSubcategory : null;
  const where = buildMarketplaceWhere({
    filters,
    categoryName: category.name,
    resolvedSubcategory: activeSubcategory,
  });

  const [listing, bookmarkedIdeaIds, subcategoryCounts, priceAggregate, exclusiveCount] =
    await Promise.all([
      getMarketplaceIdeas({ filters, where }),
      getBookmarkedIdeaIds(clerkId),
      getSubcategoryIdeaCounts(category.name),
      prisma.idea.aggregate({
        where: {
          published: true,
          category: category.name,
        },
        _avg: { priceInCents: true },
      }),
      prisma.idea.count({
        where: {
          published: true,
          category: category.name,
          unlockType: "EXCLUSIVE",
        },
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
    typeof priceAggregate._avg.priceInCents === "number"
      ? formatPrice(Math.round(priceAggregate._avg.priceInCents))
      : "N/A";
  const CategoryIcon = getCategoryIcon(category.icon);

  const relatedCategories = Object.values(CATEGORY_META).filter(
    (c) => c.slug !== slug
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <section className="relative overflow-hidden border-b border-border/70 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98)_0%,_rgba(241,245,249,0.92)_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.16),_transparent_34%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(250,204,21,0.14),_transparent_20%)]" />

        <div className="container mx-auto max-w-[1400px] px-6 py-14 lg:px-8 lg:py-18">
          <nav className="mb-8 flex items-center gap-1.5 text-sm">
            <Link href="/" className="text-muted-foreground transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <Link
              href="/ideas"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Marketplace
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="font-medium text-foreground">{category.name}</span>
          </nav>

          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Compass className="h-3.5 w-3.5" />
                Category collection
              </div>

              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-primary/20 bg-primary/10 text-primary shadow-sm">
                  <CategoryIcon className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-[38px] font-semibold tracking-[-0.04em] text-foreground sm:text-[46px]">
                    {category.name}
                  </h1>
                  <p className="mt-4 max-w-2xl text-[16px] leading-8 text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-border/70 bg-card/95 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Live ideas
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
                    {listing.total}
                  </p>
                </div>
                <div className="rounded-[24px] border border-border/70 bg-card/95 p-4 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Exclusive drops
                  </p>
                  <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
                    {exclusiveCount}
                  </p>
                </div>
                <div className="rounded-[24px] border border-border/70 bg-card/95 p-4 shadow-sm">
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
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    Why this lane
                  </p>
                  <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-foreground">
                    A focused realm for buyers with specific taste
                  </h2>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] bg-[linear-gradient(135deg,_rgba(15,23,42,0.96)_0%,_rgba(67,56,202,0.92)_100%)] p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                  Current signal
                </p>
                <p className="mt-3 text-lg font-semibold">
                  {listing.total} ideas available in {category.name}.
                </p>
                <p className="mt-2 text-sm leading-7 text-white/75">
                  Sorted by {getSortLabel(filters.sortBy).toLowerCase()}
                  {activeSubcategory ? ` and narrowed to ${activeSubcategory.name}` : ""}.
                </p>
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Quick lanes
                </p>
                {subcategoryCounts.length === 0 ? (
                  <div className="mt-3 rounded-[22px] border border-dashed border-border bg-background/80 p-4 text-sm text-muted-foreground">
                    This category is still broad. Subcategory lanes will appear as more ideas are published.
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/ideas/category/${slug}`}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        activeSubcategory
                          ? "border-border bg-background text-muted-foreground hover:text-foreground"
                          : "border-primary/20 bg-primary/10 text-primary"
                      }`}
                    >
                      All {category.name}
                    </Link>
                    {subcategoryCounts.slice(0, 8).map((subcategory) => (
                      <Link
                        key={subcategory.slug}
                        href={`/ideas/category/${slug}?subcategory=${subcategory.slug}`}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          activeSubcategory?.slug === subcategory.slug
                            ? "border-primary/20 bg-primary/10 text-primary"
                            : "border-border bg-background text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {subcategory.name} · {subcategory.count}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container relative z-10 mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="-mt-8">
          <Suspense
            fallback={<div className="h-[320px] animate-pulse rounded-[30px] bg-border/40" />}
          >
            <IdeaFilters
              total={listing.total}
              activeCategorySlug={slug}
              activeCategoryName={category.name}
              featuredSubcategories={subcategoryCounts}
            />
          </Suspense>
        </div>

        <section className="pb-16 pt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {category.name}
              </p>
              <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-foreground">
                Hidden ideas in this collection
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                Every card keeps the full execution hidden until purchase while still giving
                enough signal to compare concept quality, traction, and creator credibility.
              </p>
            </div>

            {activeSubcategory && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[12px] font-medium text-primary">
                Focused lane: {activeSubcategory.name}
              </span>
            )}
          </div>

          {listing.ideas.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-card/95 px-6 py-20 text-center shadow-sm">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted">
                <Lightbulb className="h-7 w-7 text-primary/40" />
              </div>
              <p className="text-[22px] font-semibold tracking-[-0.03em] text-foreground">
                No mysteries in this lane yet
              </p>
              <p className="mt-3 max-w-lg text-[15px] leading-7 text-muted-foreground">
                Try a broader pass through {category.name}, remove a filter, or explore another
                collection from the marketplace.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full px-6">
                  <Link href={`/ideas/category/${slug}`}>Reset this collection</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-border bg-background/80 px-6">
                  <Link href="/ideas">Browse all ideas</Link>
                </Button>
              </div>
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
                      basePath={`/ideas/category/${slug}`}
                    />
                  </Suspense>
                </div>
              )}
            </>
          )}

          <div className="mt-16 border-t border-border pt-10">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Keep exploring
                </p>
                <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-foreground">
                  Other collections buyers move through
                </h2>
              </div>
              <Button asChild variant="outline" className="hidden rounded-full border-border bg-background/80 sm:inline-flex">
                <Link href="/ideas">
                  Explore the whole marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {relatedCategories.slice(0, 8).map((cat) => {
                const RelatedIcon = getCategoryIcon(cat.icon);

                return (
                  <Link
                    key={cat.slug}
                    href={`/ideas/category/${cat.slug}`}
                    className="group flex shrink-0 items-center gap-3 rounded-[18px] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:text-primary"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <RelatedIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p>{cat.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Explore this collection
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

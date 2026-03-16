import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowRight,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { Pagination } from "@/components/shared/pagination";
import { CATEGORY_META, getCategoryBySlug } from "@/lib/constants";
import { getCategoryIcon } from "@/lib/categories";
import {
  buildMarketplaceWhere,
  getBookmarkedIdeaIds,
  getIdeaRatings,
  getMarketplaceIdeas,
  normalizeMarketplaceSearchParams,
  resolveSubcategory,
} from "@/features/ideas/lib/marketplace-data";

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
  const CategoryIcon = getCategoryIcon(category.icon);

  const relatedCategories = Object.values(CATEGORY_META).filter(
    (c) => c.slug !== slug
  );

  return (
    <div className="min-h-screen bg-[hsl(var(--surface))]">
      <section className="border-b border-border/70 bg-[hsl(var(--surface))] py-12">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm">
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

          {/* Category header */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <CategoryIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-[36px] font-bold tracking-[-0.03em] text-foreground">
                {category.name}
              </h1>
              <p className="mt-1 text-[15px] text-muted-foreground">{category.description}</p>
            </div>
          </div>

          <p className="mt-6 text-[13px] text-muted-foreground">
            {listing.total} {listing.total === 1 ? "idea" : "ideas"} available
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-[1400px] px-6 py-8 lg:px-8">
        <Suspense
          fallback={<div className="h-[72px] animate-pulse rounded-[30px] bg-border/40" />}
        >
          <IdeaFilters
            total={listing.total}
            activeCategorySlug={slug}
            activeCategoryName={category.name}
          />
        </Suspense>

        <section className="pb-16 pt-10">
          {listing.ideas.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-card/95 px-6 py-20 text-center shadow-sm">
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

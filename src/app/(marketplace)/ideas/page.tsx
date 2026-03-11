import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { Pagination } from "@/components/shared/pagination";
import { Lightbulb } from "lucide-react";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Explore Ideas - MysteryMarket",
  description: "Browse and unlock premium ideas from top creators.",
};

interface IdeasPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    unlockType?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function IdeasPage({ searchParams }: IdeasPageProps) {
  const params = await searchParams;
  const { userId: clerkId } = await auth();

  const search = params?.search ?? "";
  const category = params?.category ?? "";
  const unlockType = params?.unlockType ?? "";
  const sortBy = params?.sortBy ?? "newest";
  const page = Math.max(1, parseInt(params?.page ?? "1", 10));

  const where = {
    published: true,
    ...(category ? { category } : {}),
    ...(unlockType === "EXCLUSIVE" || unlockType === "MULTI"
      ? { unlockType: unlockType as "EXCLUSIVE" | "MULTI" }
      : {}),
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const isBestRated = sortBy === "best-rated";

  const orderBy =
    sortBy === "price-low"
      ? { priceInCents: "asc" as const }
      : sortBy === "price-high"
        ? { priceInCents: "desc" as const }
        : sortBy === "most-purchased"
          ? { purchases: { _count: "desc" as const } }
          : { createdAt: "desc" as const };

  const defaultInclude = {
    creator: { select: { id: true, name: true, avatarUrl: true } },
    _count: { select: { purchases: true } },
  } as const;

  // For best-rated, use groupBy on reviews to get DB-level average-rating sort,
  // then fetch matching ideas in that order (ideas with no reviews appear last).
  let sortedIdeas: Awaited<ReturnType<typeof prisma.idea.findMany<{ include: typeof defaultInclude }>>>;
  let total: number;
  let bookmarkedIdeaIds: Set<string>;

  if (isBestRated) {
    // Get average ratings for all reviewed ideas matching the filter
    const ratingGroups = await prisma.review.groupBy({
      by: ["ideaId"],
      where: { idea: where },
      _avg: { rating: true },
      orderBy: { _avg: { rating: "desc" } },
    });

    const ratedIdeaIds = ratingGroups.map((g) => g.ideaId);
    const ratingMap = new Map(ratingGroups.map((g) => [g.ideaId, g._avg.rating ?? 0]));

    // Fetch all matching ideas (rated + unrated), get count, and bookmarks in parallel
    const [allIdeas, countResult, bookmarks] = await Promise.all([
      prisma.idea.findMany({
        where,
        include: defaultInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.idea.count({ where }),
      clerkId
        ? prisma.bookmark
            .findMany({ where: { user: { clerkId } }, select: { ideaId: true } })
            .then((bs) => new Set(bs.map((b) => b.ideaId)))
        : Promise.resolve(new Set<string>()),
    ]);

    total = countResult;
    bookmarkedIdeaIds = bookmarks;

    // Sort: rated ideas by avg rating desc, then unrated ideas by createdAt desc
    const ratedIdeasSorted = ratedIdeaIds
      .map((rId) => allIdeas.find((i) => i.id === rId))
      .filter((i): i is (typeof allIdeas)[0] => i !== undefined);
    const ideasWithNoRating = allIdeas.filter((i) => !ratingMap.has(i.id));
    const allSorted = [...ratedIdeasSorted, ...ideasWithNoRating];
    sortedIdeas = allSorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  } else {
    const [rawIdeas, countResult, bookmarks] = await Promise.all([
      prisma.idea.findMany({
        where,
        include: defaultInclude,
        orderBy,
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
      }),
      prisma.idea.count({ where }),
      clerkId
        ? prisma.bookmark
            .findMany({ where: { user: { clerkId } }, select: { ideaId: true } })
            .then((bs) => new Set(bs.map((b) => b.ideaId)))
        : Promise.resolve(new Set<string>()),
    ]);
    sortedIdeas = rawIdeas;
    total = countResult;
    bookmarkedIdeaIds = bookmarks;
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="bg-[hsl(var(--surface))] min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="mb-8 pb-6 border-b border-border">
          <h1 className="text-[32px] font-bold tracking-tight text-foreground">Explore Marketplace</h1>
          <p className="mt-2 text-[16px] leading-[1.6] text-muted-foreground">
            Discover and unlock high-value hidden ideas from verified creators.
            {total > 0 && (
              <span className="ml-2 font-medium text-primary">({total} available)</span>
            )}
          </p>
        </div>

        <div className="mb-10">
          <Suspense fallback={<div className="h-[52px] animate-pulse rounded-[12px] bg-border/50 w-full" />}>
            <IdeaFilters />
          </Suspense>
        </div>

        {sortedIdeas.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center rounded-[12px] border border-dashed border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
              <Lightbulb className="h-7 w-7 text-primary/40" />
            </div>
            <p className="text-[18px] font-bold text-foreground">No mysteries to uncover here… yet</p>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Try adjusting your filters or explore a different category
            </p>
            {(search || category || unlockType) && (
              <Link
                href="/ideas"
                className="mt-4 text-[14px] font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                Clear all filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {sortedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  id={idea.id}
                  title={idea.title}
                  teaserText={idea.teaserText}
                  teaserImageUrl={idea.teaserImageUrl}
                  priceInCents={idea.priceInCents}
                  unlockType={idea.unlockType}
                  category={idea.category}
                  creatorId={idea.creator.id}
                  creatorName={idea.creator.name}
                  creatorAvatarUrl={idea.creator.avatarUrl}
                  purchaseCount={idea._count.purchases}
                  initialBookmarked={bookmarkedIdeaIds.has(idea.id)}
                  isAuthenticated={!!clerkId}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center pt-8 border-t border-border">
                <Suspense fallback={null}>
                  <Pagination currentPage={page} totalPages={totalPages} basePath="/ideas" />
                </Suspense>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

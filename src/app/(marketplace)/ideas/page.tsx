import type { Metadata } from "next";
import { Suspense } from "react";
import { IdeaCard } from "@/components/idea-card";
import { IdeaFilters } from "@/components/idea-filters";
import { Pagination } from "@/components/pagination";
import prisma from "@/lib/prisma";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Explore Ideas - MysteryIdea",
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
  const search = params.search ?? "";
  const category = params.category ?? "";
  const unlockType = params.unlockType ?? "";
  const sortBy = params.sortBy ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

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

  const orderBy =
    sortBy === "price-low"
      ? { priceInCents: "asc" as const }
      : sortBy === "price-high"
        ? { priceInCents: "desc" as const }
        : { createdAt: "desc" as const };

  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { purchases: true } },
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.idea.count({ where }),
  ]);

  // Sort by most purchased after fetching when needed
  const sortedIdeas =
    sortBy === "most-purchased"
      ? [...ideas].sort((a, b) => b._count.purchases - a._count.purchases)
      : ideas;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Explore Ideas</h1>
        <p className="mt-2 text-muted-foreground">
          Discover and unlock premium ideas from top creators
          {total > 0 && (
            <span className="ml-2 text-sm">({total} ideas found)</span>
          )}
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <IdeaFilters />
        </Suspense>
      </div>

      {sortedIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-foreground">
            No ideas found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your filters or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Suspense>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}

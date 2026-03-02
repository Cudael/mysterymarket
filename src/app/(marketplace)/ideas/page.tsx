import type { Metadata } from "next";
import { Suspense } from "react";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters";
import { Pagination } from "@/components/shared/pagination";
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
    <div className="bg-[#F5F6FA] min-h-screen py-16">
      <div className="container mx-auto px-6 lg:px-8">
        
        <div className="mb-10 pb-6 border-b border-[#D9DCE3]">
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Explore Marketplace</h1>
          <p className="mt-3 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
            Discover and unlock premium ideas from top creators
            {total > 0 && (
              <span className="ml-2 font-medium text-[#3A5FCD]">({total} ideas found)</span>
            )}
          </p>
        </div>

        <div className="mb-10">
          <Suspense>
            <IdeaFilters />
          </Suspense>
        </div>

        {sortedIdeas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF]">
            <p className="text-lg font-semibold text-[#1A1A1A]">
              No ideas found
            </p>
            <p className="mt-2 text-[16px] text-[#1A1A1A]/70">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center border-t border-[#D9DCE3] pt-10">
                <Pagination currentPage={page} totalPages={totalPages} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

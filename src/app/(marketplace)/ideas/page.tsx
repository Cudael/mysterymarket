import { Suspense } from "react";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { IdeaFilters } from "@/features/ideas/components/idea-filters-client";
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
  const sortBy = params?.sortBy ?? "";
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

  const orderBy =
    sortBy === "price-low"
      ? { priceInCents: "asc" as const }
      : sortBy === "price-high"
        ? { priceInCents: "desc" as const }
        : { createdAt: "desc" as const };

  // Fetch ideas + bookmark IDs for authenticated user in parallel
  const [ideas, total, bookmarkedIdeaIds] = await Promise.all([
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
    clerkId
      ? prisma.bookmark
          .findMany({
            where: { user: { clerkId } },
            select: { ideaId: true },
          })
          .then((bs) => new Set(bs.map((b) => b.ideaId)))
      : Promise.resolve(new Set<string>()),
  ]);

  const sortedIdeas =
    sortBy === "most-purchased"
      ? [...ideas].sort((a, b) => b._count.purchases - a._count.purchases)
      : ideas;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="bg-[#F8F9FC] min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-[1400px] animate-in fade-in slide-in-from-bottom-4 duration-500">

        <div className="mb-8 pb-6 border-b border-[#D9DCE3]">
          <h1 className="text-[32px] font-bold tracking-tight text-[#1A1A1A]">Explore Marketplace</h1>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
            Discover and unlock high-value hidden ideas from verified creators.
            {total > 0 && (
              <span className="ml-2 font-medium text-[#3A5FCD]">({total} available)</span>
            )}
          </p>
        </div>

        <div className="mb-10">
          <Suspense fallback={<div className="h-[52px] animate-pulse rounded-[12px] bg-[#D9DCE3]/50 w-full" />}>
            <IdeaFilters />
          </Suspense>
        </div>

        {sortedIdeas.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
             <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F8F9FC] border border-[#D9DCE3]">
              <Lightbulb className="h-7 w-7 text-[#1A1A1A]/30" />
            </div>
            <p className="text-[18px] font-bold text-[#1A1A1A]">No ideas found</p>
            <p className="mt-2 text-[15px] text-[#1A1A1A]/60">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
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
              <div className="flex justify-center pt-8 border-t border-[#D9DCE3]">
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

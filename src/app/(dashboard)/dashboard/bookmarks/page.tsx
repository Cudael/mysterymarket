import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { getBookmarks } from "@/features/bookmarks/actions";

export const metadata: Metadata = {
  title: "Saved Ideas - MysteryMarket",
};

export default async function BookmarksPage() {
  let bookmarks: Awaited<ReturnType<typeof getBookmarks>> = [];
  try {
    bookmarks = await getBookmarks();
  } catch {
    // Not authenticated — show empty state
  }

  return (
    <div className="mx-auto max-w-5xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-[#D9DCE3] pb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Saved Ideas</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          Ideas you've saved to revisit and unlock later.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#F8F9FC] py-24 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D9DCE3]">
            <Bookmark className="h-7 w-7 text-[#1A1A1A]/40" />
          </div>
          <p className="text-[18px] font-semibold text-[#1A1A1A]">
            You haven&apos;t saved any ideas yet
          </p>
          <p className="mt-2 text-[15px] text-[#1A1A1A]/60 max-w-md">
            Browse the marketplace and click the bookmark icon on any idea to save it here.
          </p>
          <Button asChild className="mt-8 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white font-medium h-11 px-6 shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all">
            <Link href="/ideas">
              Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map(({ idea }) => (
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
              initialBookmarked={true}
              isAuthenticated={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

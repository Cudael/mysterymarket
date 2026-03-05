import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Saved Ideas" },
        ]}
      />
      <div className="mb-8 border-b border-[#D9DCE3] pb-6">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Saved Ideas</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          Ideas you&apos;ve saved to revisit and unlock later.
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="h-9 w-9 text-[#1A1A1A]/40" />}
          title="No saved ideas yet"
          description="When you find ideas that interest you, bookmark them to revisit later."
          action={{ label: "Explore Marketplace", href: "/ideas" }}
        />
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

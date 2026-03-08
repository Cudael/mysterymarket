import type { Metadata } from "next";
import { Bookmark, Compass } from "lucide-react";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/shared/dashboard-card";
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
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Overview", href: "/dashboard" },
          { label: "Saved Ideas" },
        ]}
      />

      <PageHeader
        title="Saved Ideas"
        description="Keep track of ideas you want to revisit, compare, or unlock later."
        icon={<Bookmark className="h-6 w-6 text-white" />}
      />

      {bookmarks.length === 0 ? (
        <DashboardCard bodyClassName="p-0">
          <div className="rounded-[16px] bg-[#F8F9FC] p-2">
            <EmptyState
              icon={<Bookmark className="h-9 w-9 text-[#1A1A1A]/40" />}
              title="No saved ideas yet"
              description="Bookmark ideas as you browse the marketplace so you can come back to them when you're ready."
              action={{ label: "Explore Marketplace", href: "/ideas" }}
            />
          </div>

          <div className="border-t border-[#D9DCE3] px-6 py-5">
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-5 w-5 text-[#3A5FCD]" />
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A1A]">
                  Quick tip
                </p>
                <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/60">
                  Use bookmarks to shortlist ideas before buying. It’s an easy way
                  to compare pricing, categories, and creators.
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>
      ) : (
        <DashboardCard
          title="Your Bookmarks"
          bodyClassName="p-0 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </DashboardCard>
      )}
    </div>
  );
}

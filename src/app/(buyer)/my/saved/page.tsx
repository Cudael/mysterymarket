import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Compass, Sparkles } from "lucide-react";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
import { getBookmarks } from "@/features/bookmarks/actions";

export const metadata: Metadata = {
  title: "Saved Ideas - MysteryMarket",
};

export default async function SavedPage() {
  let bookmarks: Awaited<ReturnType<typeof getBookmarks>> = [];
  try {
    bookmarks = await getBookmarks();
  } catch {
    // Not authenticated — show empty state
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Saved Ideas"
        description="Ideas you've bookmarked for later. Your personal shortlist."
        icon={<Bookmark className="h-6 w-6 text-white" />}
        action={
          bookmarks.length > 0 ? (
            <Link
              href="/ideas"
              className="flex items-center gap-2 rounded-[9px] border border-border bg-card px-4 py-2 text-[14px] font-medium text-foreground/70 transition-all hover:border-primary/30 hover:text-primary"
            >
              <Sparkles className="h-4 w-4" />
              Explore More
            </Link>
          ) : undefined
        }
      />

      {bookmarks.length > 0 && (
        <div className="flex items-center gap-2 rounded-[12px] border border-border bg-card px-5 py-3">
          <Bookmark className="h-4 w-4 text-primary" />
          <span className="text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">{bookmarks.length}</span>{" "}
            {bookmarks.length === 1 ? "idea" : "ideas"} saved
          </span>
        </div>
      )}

      {bookmarks.length === 0 ? (
        <ContentCard bodyClassName="p-0">
          <div className="rounded-[16px] bg-muted p-2">
            <EmptyState
              icon={<Bookmark className="h-9 w-9 text-foreground/40" />}
              title="Your shortlist is empty"
              description="Save ideas you're interested in while browsing the marketplace. They'll appear here for easy access."
              action={{ label: "Browse Ideas", href: "/ideas" }}
            />
          </div>

          <div className="border-t border-border px-6 py-5">
            <div className="flex items-start gap-3">
              <Compass className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-[14px] font-semibold text-foreground">
                  Quick tip
                </p>
                <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                  Use bookmarks to shortlist ideas before buying. It&apos;s an easy way
                  to compare pricing, categories, and creators.
                </p>
              </div>
            </div>
          </div>
        </ContentCard>
      ) : (
        <ContentCard
          title="Your Saved Ideas"
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
                isCreatorVerified={idea.creator.stripeOnboarded}
                purchaseCount={idea._count.purchases}
                initialBookmarked={true}
                isAuthenticated={true}
              />
            ))}
          </div>
        </ContentCard>
      )}
    </div>
  );
}

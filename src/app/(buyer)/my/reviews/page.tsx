import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Star, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
import { EmptyState } from "@/components/shared/empty-state";
import { getUserReviews, getPurchasesWithoutReviews } from "@/features/reviews/actions";

export const metadata: Metadata = {
  title: "My Reviews - MysteryMarket",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-[hsl(var(--gold))] text-[hsl(var(--gold))]"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [reviews, pendingReviews] = await Promise.all([
    getUserReviews(),
    getPurchasesWithoutReviews(),
  ]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="My Reviews"
        description="Share your experiences and help the community discover great ideas."
        icon={<Star className="h-6 w-6 text-white" />}
      />

      {/* Stats row */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2.5 rounded-[12px] border border-border bg-card px-5 py-3.5">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-[13px] text-muted-foreground">Reviews written</span>
          <span className="text-[15px] font-bold text-foreground">{reviews.length}</span>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2.5 rounded-[12px] border border-border bg-card px-5 py-3.5">
            <Star className="h-4 w-4 text-[hsl(var(--gold))]" />
            <span className="text-[13px] text-muted-foreground">Average rating given</span>
            <span className="text-[15px] font-bold text-foreground">{averageRating.toFixed(1)}</span>
          </div>
        )}
        {pendingReviews.length > 0 && (
          <div className="flex items-center gap-2.5 rounded-[12px] border border-amber-500/20 bg-amber-500/5 px-5 py-3.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-[13px] text-muted-foreground">Awaiting your review</span>
            <span className="text-[15px] font-bold text-amber-400">{pendingReviews.length}</span>
          </div>
        )}
      </div>

      {/* Pending review prompts */}
      {pendingReviews.length > 0 && (
        <ContentCard
          title="Share Your Experience"
          titleIcon={Sparkles}
          bodyClassName="p-6"
        >
          <p className="mb-4 text-[13px] text-muted-foreground">
            You haven&apos;t reviewed these ideas yet. Help other buyers by sharing your thoughts.
          </p>
          <div className="flex flex-col gap-3">
            {pendingReviews.map((purchase) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-muted p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-foreground">
                    {purchase.idea.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {purchase.idea.category ?? "General"}
                    {purchase.idea.creator.name && (
                      <> · by {purchase.idea.creator.name}</>
                    )}
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/ideas/${purchase.idea.id}`}>
                    <Star className="mr-1.5 h-3.5 w-3.5" />
                    Review
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </ContentCard>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <ContentCard bodyClassName="p-0">
          <div className="rounded-[16px] bg-muted p-2">
            <EmptyState
              icon={<Star className="h-9 w-9 text-foreground/40" />}
              title="No reviews yet"
              description="Once you purchase and explore ideas, you can leave reviews to help other buyers make great choices."
              action={{ label: "Browse Ideas", href: "/ideas" }}
            />
          </div>
        </ContentCard>
      ) : (
        <ContentCard
          title="Your Reviews"
          titleIcon={MessageSquare}
          action={
            <Link
              href="/my"
              className="flex items-center gap-1 text-[13px] font-medium text-primary transition-colors hover:text-primary/80"
            >
              My Library <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    {/* Idea info */}
                    <Link
                      href={`/ideas/${review.idea.id}`}
                      className="text-[16px] font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {review.idea.title}
                    </Link>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      {review.idea.category && (
                        <Badge variant="outline" className="border-border text-foreground/70 text-[11px]">
                          {review.idea.category}
                        </Badge>
                      )}
                      {review.idea.creator.name && (
                        <Link
                          href={`/profile/${review.idea.creator.id}`}
                          className="text-[12px] text-muted-foreground transition-colors hover:text-primary"
                        >
                          by {review.idea.creator.name}
                        </Link>
                      )}
                      <span className="text-[12px] text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="mt-3 flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-[13px] font-semibold text-foreground">
                        {review.rating}/5
                      </span>
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="mt-2 text-[14px] leading-6 text-muted-foreground">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/ideas/${review.idea.id}`}>
                        View Idea
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )}
    </div>
  );
}

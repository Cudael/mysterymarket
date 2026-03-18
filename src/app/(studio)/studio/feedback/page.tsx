import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { MessageSquare, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  getReviewsForCreator,
  getCreatorReviewStats,
} from "@/features/reviews/actions";

export const metadata: Metadata = {
  title: "Feedback - Creator Studio - MysteryMarket",
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export default async function FeedbackPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [reviews, stats] = await Promise.all([
    getReviewsForCreator(),
    getCreatorReviewStats(),
  ]);

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Feedback"
        description="All reviews left on your ideas by buyers."
        icon={<MessageSquare className="h-6 w-6 text-white" />}
      />

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Average Rating"
          value={stats.total > 0 ? stats.average.toFixed(1) : "—"}
          icon={Star}
          subLabel={stats.total > 0 ? `From ${stats.total} review${stats.total !== 1 ? "s" : ""}` : "No reviews yet"}
        />
        <StatCard
          label="Total Reviews"
          value={stats.total}
          icon={MessageSquare}
          subLabel="Across all your ideas"
        />
        <div className="rounded-[12px] border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
            Star Breakdown
          </p>
          <div className="mt-3 space-y-1.5">
            {stats.breakdown.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="w-5 text-right text-[12px] font-medium text-foreground/70">
                  {star}
                </span>
                <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted border border-border">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{
                      width:
                        stats.total > 0
                          ? `${Math.round((count / stats.total) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="w-6 text-right text-[12px] text-muted-foreground">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <ContentCard
        title="Reviews"
        bodyClassName="p-6"
      >
        {reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-8 w-8 text-primary" />}
            title="No reviews yet"
            description="When buyers review your ideas, their feedback will appear here."
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const initials = (review.buyer.name ?? "?")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={review.id}
                  className="rounded-[12px] border border-border bg-muted p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-9 w-9 shrink-0 border border-border">
                      <AvatarImage
                        src={review.buyer.avatarUrl ?? undefined}
                        alt={review.buyer.name ?? "Buyer"}
                      />
                      <AvatarFallback className="bg-card text-primary text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold text-foreground">
                          {review.buyer.name ?? "Anonymous"}
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          on{" "}
                          <Link
                            href={`/ideas/${review.idea.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {review.idea.title}
                          </Link>
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-center gap-3">
                        <StarDisplay rating={review.rating} />
                        <span className="text-[12px] text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="mt-2 text-[14px] leading-6 text-foreground/80">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ContentCard>
    </div>
  );
}

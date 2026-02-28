import { Star } from "lucide-react";
import { getReviewsForIdea, getAverageRating } from "@/actions/reviews";

interface ReviewListProps {
  ideaId: string;
}

export async function ReviewList({ ideaId }: ReviewListProps) {
  const [reviews, { average, count }] = await Promise.all([
    getReviewsForIdea(ideaId),
    getAverageRating(ideaId),
  ]);

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-foreground">Reviews</h2>
        {count > 0 && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">
              {average.toFixed(1)}
            </span>
            <span>({count})</span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {(review.buyer.name ?? "?")[0].toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {review.buyer.name ?? "Anonymous"}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="mb-2 flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

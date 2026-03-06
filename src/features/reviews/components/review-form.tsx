"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/features/reviews/actions";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"] as const;

const MAX_COMMENT_LENGTH = 1000;

interface ReviewFormProps {
  ideaId: string;
}

export function ReviewForm({ ideaId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (rating === 0) {
      setRatingError(true);
      toast.error("Please select a star rating");
      return;
    }
    setRatingError(false);
    startTransition(async () => {
      try {
        await createReview(ideaId, rating, comment);
        toast.success("Review posted! ⭐", { description: "Thanks for your feedback." });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to submit review"
        );
      }
    });
  }

  const charsRemaining = MAX_COMMENT_LENGTH - comment.length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Leave a Review
      </h3>
      <div className="mb-1 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => { setRating(star); setRatingError(false); }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {RATING_LABELS[rating]}
          </span>
        )}
      </div>
      <p className={ratingError ? "mb-3 text-xs text-destructive" : "invisible mb-3 text-xs"}>
        Please select a rating before submitting.
      </p>
      <div className="relative">
        <Textarea
          placeholder="Share your thoughts (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
          rows={3}
          className="mb-1 resize-none"
          aria-label="Review comment"
        />
        <p className={`mb-3 text-right text-xs ${charsRemaining < 50 ? "text-amber-500" : "text-muted-foreground"}`}>
          {charsRemaining} characters remaining
        </p>
      </div>
      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/actions/reviews";

interface ReviewFormProps {
  ideaId: string;
}

export function ReviewForm({ ideaId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    startTransition(async () => {
      try {
        await createReview(ideaId, rating, comment);
        toast.success("Review submitted!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to submit review"
        );
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-base font-semibold text-foreground">
        Leave a Review
      </h3>
      <div className="mb-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
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
      </div>
      <Textarea
        placeholder="Share your thoughts (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="mb-4"
      />
      <Button onClick={handleSubmit} disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}

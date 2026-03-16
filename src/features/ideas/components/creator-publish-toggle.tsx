"use client";

import { useState } from "react";
import { toast } from "sonner";
import { publishIdea } from "@/features/ideas/actions";
import { Button } from "@/components/ui/button";

export function CreatorPublishToggle({
  ideaId,
  published,
}: {
  ideaId: string;
  published: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(published);

  async function handleToggle() {
    setLoading(true);
    try {
      await publishIdea(ideaId, !isPublished);
      setIsPublished(!isPublished);
      if (isPublished) {
        toast("Idea unpublished", {
          description: "It's now hidden from the marketplace.",
        });
      } else {
        toast.success("Idea published! 🚀", {
          description: "It's now visible in the marketplace.",
        });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant={isPublished ? "outline" : "default"}
      disabled={loading}
      onClick={handleToggle}
      className={`h-8 text-xs ${
        isPublished
          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
          : ""
      }`}
    >
      {loading ? "..." : isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}

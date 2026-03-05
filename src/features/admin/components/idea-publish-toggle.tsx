"use client";

import { useState } from "react";
import { toast } from "sonner";
import { toggleIdeaPublished } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";

export function IdeaPublishToggle({
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
      await toggleIdeaPublished(ideaId, !isPublished);
      setIsPublished(!isPublished);
      toast.success(isPublished ? "Idea unpublished" : "Idea published");
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
          ? "border-red-200 text-red-700 hover:bg-red-50"
          : "bg-green-600 hover:bg-green-700 text-white"
      }`}
    >
      {isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}

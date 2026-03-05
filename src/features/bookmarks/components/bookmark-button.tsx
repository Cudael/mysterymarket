"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toggleBookmark } from "@/features/bookmarks/actions";

interface BookmarkButtonProps {
  ideaId: string;
  initialBookmarked: boolean;
  size?: "sm" | "md";
  className?: string;
  isAuthenticated?: boolean;
}

export function BookmarkButton({
  ideaId,
  initialBookmarked,
  size = "sm",
  className,
  isAuthenticated = false,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    // Optimistic update
    setBookmarked((prev) => !prev);
    setLoading(true);

    try {
      const result = await toggleBookmark(ideaId);
      setBookmarked(result.bookmarked);
      if (result.bookmarked) {
        toast.success("Saved to bookmarks", { description: "Find it in your Saved Ideas." });
      } else {
        toast("Removed from bookmarks");
      }
    } catch {
      // Revert optimistic update
      setBookmarked((prev) => !prev);
      toast.error("Failed to save bookmark", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={bookmarked ? "Remove from saved" : "Save idea"}
      className={cn(
        "inline-flex items-center justify-center rounded-[8px] border transition-all duration-200 disabled:opacity-50",
        bookmarked
          ? "border-[#3A5FCD]/30 bg-[#3A5FCD]/10 text-[#3A5FCD] hover:bg-[#3A5FCD]/20"
          : "border-[#D9DCE3] bg-[#FFFFFF] text-[#1A1A1A]/50 hover:border-[#3A5FCD]/30 hover:text-[#3A5FCD]",
        buttonSize,
        className
      )}
    >
      {bookmarked ? (
        <BookmarkCheck className={iconSize} />
      ) : (
        <Bookmark className={iconSize} />
      )}
    </button>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/features/follows/actions";

interface FollowButtonProps {
  creatorId: string;
  initialFollowing: boolean;
  initialFollowerCount: number;
  isAuthenticated: boolean;
}

export function FollowButton({
  creatorId,
  initialFollowing,
  initialFollowerCount,
  isAuthenticated,
}: FollowButtonProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }
    setLoading(true);
    try {
      const result = await toggleFollow(creatorId);
      setFollowing(result.following);
      setFollowerCount(result.followerCount);
    } catch (err) {
      console.error("[follow-button] toggleFollow failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1 sm:items-start">
      {following ? (
        <Button
          onClick={handleClick}
          disabled={loading}
          variant="outline"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label={loading ? "Loading" : hovered ? "Unfollow creator" : "Following creator"}
          className={`h-9 min-w-[110px] rounded-[8px] border border-border text-[14px] font-medium transition-colors ${
            hovered
              ? "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/10"
              : "bg-card text-foreground"
          }`}
        >
          {loading ? "..." : hovered ? "Unfollow" : "Following"}
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          disabled={loading}
          aria-label={loading ? "Loading" : "Follow creator"}
          className="h-9 min-w-[110px] rounded-[8px] text-[14px] font-medium transition-colors"
        >
          {loading ? "..." : "Follow"}
        </Button>
      )}
      <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
        <Users className="h-3 w-3" />
        {followerCount} follower{followerCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

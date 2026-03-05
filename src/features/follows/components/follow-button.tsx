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
          className={`h-9 min-w-[110px] rounded-[8px] border border-[#D9DCE3] text-[14px] font-medium transition-colors ${
            hovered
              ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-50"
              : "bg-[#FFFFFF] text-[#1A1A1A]"
          }`}
        >
          {loading ? "..." : hovered ? "Unfollow" : "Following"}
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          disabled={loading}
          aria-label={loading ? "Loading" : "Follow creator"}
          className="h-9 min-w-[110px] rounded-[8px] bg-[#3A5FCD] text-[14px] font-medium text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)] hover:bg-[#6D7BE0] transition-colors"
        >
          {loading ? "..." : "Follow"}
        </Button>
      )}
      <span className="flex items-center gap-1 text-[12px] text-[#1A1A1A]/50">
        <Users className="h-3 w-3" />
        {followerCount} follower{followerCount !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

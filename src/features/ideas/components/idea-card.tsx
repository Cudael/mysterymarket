"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Lightbulb, Star, Unlock, Users, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/features/bookmarks/components/bookmark-button";
import { CATEGORY_META } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import type { IdeaCardProps } from "@/features/ideas/types";

function normalizeUrl(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return null;
}

export function IdeaCard({
  id,
  title,
  teaserText,
  teaserImageUrl,
  priceInCents,
  unlockType,
  category,
  creatorId,
  creatorName,
  creatorAvatarUrl,
  purchaseCount,
  reviewCount,
  averageRating,
  isOwner = false,
  isPurchased = false,
  initialBookmarked = false,
  isAuthenticated = false,
  isTrending = false,
  index,
}: IdeaCardProps & { index?: number }) {
  const [imageError, setImageError] = useState(false);

  const normalizedImageUrl = normalizeUrl(teaserImageUrl);
  const normalizedCreatorAvatarUrl = normalizeUrl(creatorAvatarUrl);

  const creatorInitials = (() => {
    const value = creatorName?.trim();
    if (!value) return "?";
    const parts = value.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  })();

  const hasImage = !!normalizedImageUrl && !imageError;
  const categorySlug = category ? CATEGORY_META[category]?.slug : null;

  const unlockBadgeClasses = cn(
    "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
    unlockType === "EXCLUSIVE"
      ? "bg-violet-600/80 text-white"
      : "bg-zinc-700/80 text-zinc-200"
  );

  return (
    <div
      className={cn(
        "group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800",
        "bg-white dark:bg-zinc-900",
        "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {/* Image area */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        {hasImage ? (
          <>
            <Image
              src={normalizedImageUrl!}
              alt={title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/70 dark:bg-zinc-800/70">
              <Lightbulb className="h-7 w-7 text-violet-400 dark:text-violet-300" />
            </div>
          </div>
        )}

        {/* Badge strip */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {isTrending && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              <Flame className="h-3 w-3" /> Trending
            </span>
          )}
          <span className={unlockBadgeClasses}>
            {unlockType === "EXCLUSIVE" ? (
              <><Zap className="h-3 w-3" /> Exclusive</>
            ) : (
              <>Multi</>
            )}
          </span>
          {category && (
            categorySlug ? (
              <Link
                href={`/ideas/category/${categorySlug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-700 backdrop-blur-sm dark:bg-zinc-800/80 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700"
              >
                {category}
              </Link>
            ) : (
              <span className="flex items-center rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-700 backdrop-blur-sm dark:bg-zinc-800/80 dark:text-zinc-200">
                {category}
              </span>
            )
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/ideas/${id}`}
            className="flex-1 font-bold text-base leading-snug line-clamp-2 text-zinc-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400"
          >
            <span>{title}</span>
          </Link>
          {!isOwner && (
            <BookmarkButton
              ideaId={id}
              initialBookmarked={initialBookmarked}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>

        {/* Creator row */}
        {(creatorId || creatorName) && (
          <div className="mt-2 flex items-center justify-between">
            <Link
              href={creatorId ? `/creators/${creatorId}` : "#"}
              className="flex items-center gap-1.5 min-w-0"
              onClick={(e) => !creatorId && e.preventDefault()}
            >
              <Avatar className="h-5 w-5 shrink-0">
                <AvatarImage src={normalizedCreatorAvatarUrl ?? undefined} />
                <AvatarFallback className="text-[9px]">{creatorInitials}</AvatarFallback>
              </Avatar>
              <span className="truncate text-xs text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400">
                {creatorName ?? "Creator"}
              </span>
            </Link>
            {typeof purchaseCount === "number" && (
              <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
                <Users className="h-3.5 w-3.5" />
                {purchaseCount}
              </span>
            )}
          </div>
        )}

        {/* Teaser text */}
        {teaserText && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {teaserText}
          </p>
        )}

        {/* Rating row */}
        {typeof averageRating === "number" && typeof reviewCount === "number" && reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <span aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <span className="text-xl font-bold text-zinc-900 dark:text-white">
            {formatPrice(priceInCents)}
          </span>
          {isOwner ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs rounded-xl"
            >
              <Link href={`/studio/ideas/${id}/edit`}>Edit</Link>
            </Button>
          ) : isPurchased ? (
            <Button
              asChild
              size="sm"
              className="h-9 px-4 text-xs rounded-xl bg-green-600 hover:bg-green-700 text-white"
            >
              <Link href={`/ideas/${id}`}>
                <Unlock className="mr-1.5 h-3.5 w-3.5" />
                Read
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              size="sm"
              className="h-9 px-4 text-xs rounded-xl"
            >
              <Link href={`/ideas/${id}`}>
                <Unlock className="mr-1.5 h-3.5 w-3.5" />
                Unlock
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Lightbulb, Unlock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/features/bookmarks/components/bookmark-button";
import { CATEGORY_META } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { IdeaCardProps } from "@/features/ideas/types";

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
  isOwner = false,
  isPurchased = false,
  initialBookmarked = false,
  isAuthenticated = false,
  isTrending = false,
}: IdeaCardProps) {
  const [imageError, setImageError] = useState(false);

  const normalizedImageUrl = useMemo(() => {
    if (typeof teaserImageUrl !== "string") return null;
    const trimmed = teaserImageUrl.trim();
    if (!trimmed) return null;
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://")
    ) {
      return trimmed;
    }
    return null;
  }, [teaserImageUrl]);

  const normalizedCreatorAvatarUrl = useMemo(() => {
    if (typeof creatorAvatarUrl !== "string") return null;
    const trimmed = creatorAvatarUrl.trim();
    if (!trimmed) return null;
    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://")
    ) {
      return trimmed;
    }
    return null;
  }, [creatorAvatarUrl]);

  const creatorInitials = useMemo(() => {
    const value = creatorName?.trim();
    if (!value) return "?";

    const parts = value.split(/\s+/).filter(Boolean);
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [creatorName]);

  const hasImage = !!normalizedImageUrl && !imageError;
  const categorySlug = category ? CATEGORY_META[category]?.slug : null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-border bg-card shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-primary/20">
      {/* Header / media */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-muted">
        {hasImage ? (
          <>
            <Image
              src={normalizedImageUrl}
              alt={title}
              fill
              className={`object-cover${!isPurchased && !isOwner ? " blur-[2px]" : ""}`}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            />
            {!isPurchased && !isOwner ? (
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent backdrop-blur-[1px]" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
            )}
            {!isPurchased && !isOwner && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_hsl(var(--muted))_0%,_hsl(var(--surface))_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.08),_transparent_30%)]" />
            {!isPurchased && !isOwner && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
              </div>
            )}
            <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs font-semibold text-foreground">
                Premium insight
              </p>
            </div>
          </div>
        )}

        {/* Tags Overlay */}
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          {isTrending && (
            <span className="inline-flex items-center gap-1 rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm">
              <Flame className="h-2.5 w-2.5" />
              Trending
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide shadow-sm ${
              unlockType === "EXCLUSIVE"
                ? "border border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.15)] text-[hsl(var(--gold-foreground))]"
                : "bg-card/95 text-foreground"
            }`}
          >
            {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
          </span>

          {category &&
            (categorySlug ? (
              <Link
                href={`/ideas/category/${categorySlug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded-md bg-card/95 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm transition-colors hover:bg-card"
              >
                {category}
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-md bg-card/95 px-2 py-0.5 text-[10px] font-medium text-foreground shadow-sm">
                {category}
              </span>
            ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title and Bookmark Row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight tracking-tight text-foreground">
            <Link
              href={`/ideas/${id}`}
              className="transition-colors hover:text-primary focus:outline-none"
            >
              <span className="line-clamp-2">{title}</span>
            </Link>
          </h3>
          
          {!isOwner && (
            <div className="mt-0.5 shrink-0">
              <BookmarkButton
                ideaId={id}
                initialBookmarked={initialBookmarked}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </div>

        {/* Creator Info and Stats Row */}
        <div className="mt-3 flex items-center justify-between">
          {creatorName && (
            <Link
              href={creatorId ? `/creators/${creatorId}` : "#"}
              className={`flex items-center gap-2 text-xs text-muted-foreground ${
                creatorId ? "transition-colors hover:text-primary" : "pointer-events-none"
              }`}
            >
              <Avatar className="h-5 w-5 border border-border">
                {normalizedCreatorAvatarUrl ? (
                  <AvatarImage src={normalizedCreatorAvatarUrl} alt={creatorName} />
                ) : null}
                <AvatarFallback className="bg-muted text-[9px] font-semibold text-primary">
                  {creatorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="truncate font-medium">{creatorName}</span>
            </Link>
          )}

          {purchaseCount !== undefined && purchaseCount > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              {purchaseCount}
            </span>
          )}
        </div>

        {/* Teaser Text */}
        {teaserText && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {teaserText}
          </p>
        )}

        <div className="flex-1" />

        {/* Footer (Strictly Price & Actions) */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="text-[22px] font-bold tracking-tight text-foreground">
            {formatPrice(priceInCents)}
          </div>

          <div className="shrink-0">
            {isOwner ? (
              <Button asChild variant="outline" size="sm" className="h-9 px-4 text-xs bg-muted text-foreground hover:bg-muted/80 border-border">
                <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
              </Button>
            ) : isPurchased ? (
              <Button
                asChild
                size="sm"
                className="h-9 gap-1.5 bg-muted px-4 text-xs text-foreground hover:bg-muted/80"
              >
                <Link href={`/ideas/${id}`}>
                  <Unlock className="h-3.5 w-3.5" />
                  Read
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="h-9 gap-1.5 px-4 text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-primary-glow)]">
                <Link href={`/ideas/${id}`}>
                  <Unlock className="h-3.5 w-3.5" />
                  Unlock
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

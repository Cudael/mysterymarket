"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Lock, Star, Unlock, Users, Zap } from "lucide-react";
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
}: IdeaCardProps) {
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

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "border border-white/[0.07] bg-[hsl(252,28%,7%)]",
        "shadow-[0_2px_16px_rgba(0,0,0,0.35)]",
        "transition-all duration-300",
        "hover:-translate-y-1.5 hover:border-primary/25",
        "hover:shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(139,92,246,0.10)]"
      )}
    >
      {/* Ambient glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.07),transparent_60%)]" />

      {/* Image area */}
      <div className="relative h-48 overflow-hidden bg-[hsl(252,32%,6%)]">
        {hasImage ? (
          <>
            <Image
              src={normalizedImageUrl!}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(252,28%,7%)] via-black/10 to-transparent" />
          </>
        ) : (
          <div className="relative flex h-full items-center justify-center overflow-hidden">
            {/* Atmospheric background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(109,90,230,0.12),transparent_70%)]" />
            <div className="absolute inset-0 dot-grid-sm" />
            {/* Lock icon */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/8 shadow-[0_0_24px_rgba(109,90,230,0.15)]">
              <Lock className="h-6 w-6 text-primary/50" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[hsl(252,28%,7%)] to-transparent" />
          </div>
        )}

        {/* Lock overlay for unpurchased ideas with image */}
        {!isPurchased && !isOwner && hasImage && (
          <div className="absolute inset-0 flex items-end justify-center pb-3.5 bg-gradient-to-t from-black/65 via-black/10 to-transparent backdrop-blur-[1px]">
            <div className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-white/70" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                Unlock to reveal
              </span>
            </div>
          </div>
        )}

        {/* Badge strip */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {isTrending && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)]">
              <Flame className="h-3 w-3" /> Trending
            </span>
          )}
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
              unlockType === "EXCLUSIVE"
                ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_8px_rgba(109,90,230,0.20)]"
                : "bg-white/[0.06] text-white/45 border border-white/[0.08]"
            )}
          >
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
                className="flex items-center rounded-full bg-[hsl(252,28%,10%)]/90 border border-white/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/55 backdrop-blur-sm hover:border-primary/30 hover:text-primary transition-colors"
              >
                {category}
              </Link>
            ) : (
              <span className="flex items-center rounded-full bg-[hsl(252,28%,10%)]/90 border border-white/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/55 backdrop-blur-sm">
                {category}
              </span>
            )
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="relative flex flex-1 flex-col p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/ideas/${id}`}
            className="flex-1 text-[15px] font-bold leading-snug line-clamp-2 text-white/90 hover:text-primary transition-colors"
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
          <div className="mt-3 flex items-center justify-between">
            <Link
              href={creatorId ? `/creators/${creatorId}` : "#"}
              className="flex items-center gap-1.5 min-w-0"
              onClick={(e) => !creatorId && e.preventDefault()}
            >
              <Avatar className="h-5 w-5 shrink-0 ring-1 ring-white/10">
                <AvatarImage src={normalizedCreatorAvatarUrl ?? undefined} />
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{creatorInitials}</AvatarFallback>
              </Avatar>
              <span className="truncate text-xs text-white/35 hover:text-primary transition-colors">
                {creatorName ?? "Creator"}
              </span>
            </Link>
            {typeof purchaseCount === "number" && (
              <span className="flex items-center gap-1 text-xs text-white/30 shrink-0">
                <Users className="h-3.5 w-3.5" />
                {purchaseCount}
              </span>
            )}
          </div>
        )}

        {/* Teaser text */}
        {teaserText && (
          <p className="mt-2.5 text-[13px] leading-relaxed text-white/40 line-clamp-2">
            {teaserText}
          </p>
        )}

        {/* Rating row */}
        {typeof averageRating === "number" && typeof reviewCount === "number" && reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`} />
            <span className="text-xs font-semibold text-white/70">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-white/30">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-white/25">
              Price
            </span>
            <span className="text-[22px] font-bold tracking-tight text-white/90">
              {formatPrice(priceInCents)}
            </span>
          </div>
          {isOwner ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs rounded-xl border-white/10 bg-white/[0.03] text-white/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
            >
              <Link href={`/studio/ideas/${id}/edit`}>Edit</Link>
            </Button>
          ) : isPurchased ? (
            <Button
              asChild
              size="sm"
              className="h-9 px-4 text-xs rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
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
              className="h-9 px-5 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-primary-glow)] transition-all"
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

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Lock, Unlock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/features/bookmarks/components/bookmark-button";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/constants";
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
}: IdeaCardProps) {
  const isLocked = !isOwner && !isPurchased;
  const [imageError, setImageError] = useState(false);

  // Strict check: only treat as valid if it's a real URL
  const hasImage =
    !imageError &&
    typeof teaserImageUrl === "string" &&
    teaserImageUrl.length > 5 &&
    (teaserImageUrl.startsWith("http://") ||
      teaserImageUrl.startsWith("https://"));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">

      {/* Image Header Area */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#1A1B22]">

        {/* Always-present premium dark gradient base (visible when no image or image fails) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E1F25] via-[#2A2C35] to-[#1A1B22]" />

        {/* Image sits above the base gradient but below the dark overlay */}
        {hasImage && (
          <Image
            src={teaserImageUrl!}
            alt={title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        )}

        {/* Dark vignette overlay always rendered above the image so bright images retain the premium dark treatment */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1A1B22]/50 backdrop-blur-[2px]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 border border-[#D9DCE3] shadow-xl">
              <Lock className="h-5 w-5 text-[#3A5FCD]" strokeWidth={2.5} />
            </div>
            <span className="mt-3 rounded-full bg-white/90 border border-[#D9DCE3] px-3 py-1 text-xs font-semibold tracking-wide text-[#3A4466] shadow-xl">
              Locked Content
            </span>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute left-3 top-3 z-20">
            {CATEGORY_META[category]?.slug ? (
              <Link
                href={`/ideas/category/${CATEGORY_META[category].slug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm border border-[#D9DCE3] hover:bg-white transition-colors"
              >
                {category}
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm border border-[#D9DCE3]">
                {category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5">

        {/* Top Row */}
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                unlockType === "EXCLUSIVE"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
            </span>

            {purchaseCount !== undefined && purchaseCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {purchaseCount}
              </span>
            )}
          </div>

          {!isOwner && (
            <div className="shrink-0">
              <BookmarkButton
                ideaId={id}
                initialBookmarked={initialBookmarked}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-bold leading-tight text-foreground">
          <Link href={`/ideas/${id}`} className="hover:text-primary transition-colors focus:outline-none">
            {title}
          </Link>
        </h3>

        {teaserText && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {teaserText}
          </p>
        )}

        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-foreground">
              {formatPrice(priceInCents)}
            </span>
            {creatorName && (
              <div className="mt-0.5 flex items-center gap-1.5">
                {creatorId ? (
                  <Link
                    href={`/creators/${creatorId}`}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    by {creatorName}
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground">by {creatorName}</span>
                )}
              </div>
            )}
          </div>

          <div>
            {isOwner ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
              </Button>
            ) : isPurchased ? (
              <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
                <Link href={`/ideas/${id}`}>
                  <Unlock className="h-3.5 w-3.5" /> Read
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-1.5">
                <Link href={`/ideas/${id}`}>Unlock Now</Link>
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

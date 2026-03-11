"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  Lightbulb,
  LockKeyhole,
  Sparkles,
  Star,
  Unlock,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/features/bookmarks/components/bookmark-button";
import { CATEGORY_META, IDEA_MATURITY_LEVELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { IdeaCardProps } from "@/features/ideas/types";

const MATURITY_STYLES: Record<
  NonNullable<IdeaCardProps["maturityLevel"]>,
  string
> = {
  SEED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  CONCEPT: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  BLUEPRINT: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  PROTOTYPE_READY:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
};

export function IdeaCard({
  id,
  title,
  teaserText,
  teaserImageUrl,
  priceInCents,
  unlockType,
  category,
  subcategoryName,
  maturityLevel,
  creatorId,
  creatorName,
  creatorAvatarUrl,
  purchaseCount,
  reviewCount = 0,
  averageRating,
  tags = [],
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

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    return null;
  }, [teaserImageUrl]);

  const normalizedCreatorAvatarUrl = useMemo(() => {
    if (typeof creatorAvatarUrl !== "string") return null;

    const trimmed = creatorAvatarUrl.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
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
  const maturityLabel = maturityLevel
    ? IDEA_MATURITY_LEVELS.find((level) => level.value === maturityLevel)?.label
    : null;
  const teaserPreview = teaserText?.trim()
    ? teaserText.trim()
    : isPurchased || isOwner
      ? "This mystery has already been revealed in full."
      : "Only the outline is visible now. Unlock to reveal the full thinking, execution, and edge.";
  const lockedState = !isPurchased && !isOwner;
  const displayTags = tags.filter(Boolean).slice(0, 2);
  const ratingValue =
    typeof averageRating === "number" && reviewCount > 0
      ? averageRating.toFixed(1)
      : null;
  const availabilityLabel =
    unlockType === "EXCLUSIVE"
      ? purchaseCount && purchaseCount > 0
        ? "Claimed"
        : "Available"
      : "Open";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border/70 bg-card/95 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-[0_20px_48px_rgba(99,102,241,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative h-56 w-full shrink-0 overflow-hidden border-b border-white/10 bg-muted">
        {hasImage ? (
          <>
            <Image
              src={normalizedImageUrl}
              alt={title}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-105${
                lockedState ? " blur-[8px] saturate-[0.85]" : ""
              }`}
              onError={() => setImageError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
            />
            <div
              className={`absolute inset-0 ${
                lockedState
                  ? "bg-gradient-to-b from-slate-950/15 via-slate-950/30 to-slate-950/90 backdrop-blur-[1px]"
                  : "bg-gradient-to-b from-slate-950/10 via-slate-950/10 to-slate-950/75"
              }`}
            />
            {lockedState && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(17,24,39,0.95)_0%,_rgba(76,29,149,0.9)_55%,_rgba(17,24,39,0.98)_100%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_28%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(129,140,248,0.28),_transparent_32%)]" />
            {lockedState && (
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
              </div>
            )}
            <div className="flex h-full w-full flex-col items-center justify-center px-5 text-center text-white">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur">
                <Lightbulb className="h-5 w-5 text-[hsl(var(--gold))]" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                Hidden idea
              </p>
              <p className="mt-2 max-w-[220px] text-sm leading-6 text-white/80">
                Enough to spark curiosity. Not enough to give it away.
              </p>
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 flex max-w-[70%] flex-wrap items-center gap-2">
          {isTrending && (
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-orange-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
              <Flame className="h-3 w-3" />
              Hot
            </span>
          )}

          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur ${
              unlockType === "EXCLUSIVE"
                ? "border-[hsl(var(--gold)/0.3)] bg-[hsl(var(--gold)/0.18)] text-[hsl(var(--gold-foreground))]"
                : "border-white/20 bg-black/25 text-white"
            }`}
          >
            {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi"}
          </span>
        </div>

        {!isOwner && (
          <div className="absolute right-4 top-4">
            <BookmarkButton
              ideaId={id}
              initialBookmarked={initialBookmarked}
              isAuthenticated={isAuthenticated}
              className="border-white/15 bg-white/10 text-white backdrop-blur hover:border-white/30 hover:bg-white/20 hover:text-white"
            />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-[22px] border border-white/10 bg-slate-950/55 p-4 text-white backdrop-blur-md">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
              {lockedState ? (
                <>
                  <LockKeyhole className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                  Teaser only
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                  Revealed
                </>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/82">
              {lockedState
                ? "The visual and copy are intentionally obscured to protect the full idea until unlock."
                : "You already have access to the complete concept and can revisit it any time."}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          {category &&
            (categorySlug ? (
              <Link
                href={`/ideas/category/${categorySlug}`}
                className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75 transition-colors hover:border-primary/25 hover:text-primary"
              >
                {category}
              </Link>
            ) : (
              <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
                {category}
              </span>
            ))}

          {subcategoryName && (
            <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
              {subcategoryName}
            </span>
          )}

          {maturityLevel && maturityLabel && (
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${MATURITY_STYLES[maturityLevel]}`}
            >
              {maturityLabel}
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-foreground">
            <Link
              href={`/ideas/${id}`}
              className="transition-colors hover:text-primary focus:outline-none"
            >
              <span className="line-clamp-2">{title}</span>
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-[15px] leading-7 text-muted-foreground">
            {teaserPreview}
          </p>
        </div>

        {displayTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/8 px-3 py-1 text-[11px] font-medium text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <div className="rounded-[18px] border border-border bg-muted/35 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Unlocks
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Users className="h-4 w-4 text-primary" />
              {purchaseCount ?? 0}
            </p>
          </div>

          <div className="rounded-[18px] border border-border bg-muted/35 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Rating
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Star className="h-4 w-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
              {ratingValue ?? "Fresh"}
            </p>
          </div>

          <div className="rounded-[18px] border border-border bg-muted/35 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Access
            </p>
            <p className="mt-2 text-sm font-semibold text-foreground">
              {availabilityLabel}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[22px] border border-border bg-background/80 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Creator
              </p>
              {creatorName && (
                <Link
                  href={creatorId ? `/creators/${creatorId}` : "#"}
                  className={`mt-2 flex items-center gap-3 ${
                    creatorId ? "transition-colors hover:text-primary" : "pointer-events-none"
                  }`}
                >
                  <Avatar className="h-10 w-10 border border-border">
                    {normalizedCreatorAvatarUrl ? (
                      <AvatarImage src={normalizedCreatorAvatarUrl} alt={creatorName} />
                    ) : null}
                    <AvatarFallback className="bg-muted text-xs font-semibold text-primary">
                      {creatorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {creatorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reviewCount > 0 && ratingValue
                        ? `${ratingValue} average from ${reviewCount} review${reviewCount === 1 ? "" : "s"}`
                        : "Freshly listed mystery"}
                    </p>
                  </div>
                </Link>
              )}
            </div>

            <div className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {lockedState ? "Protected preview" : "Unlocked"}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Unlock price
            </p>
            <div className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-foreground">
              {formatPrice(priceInCents)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {unlockType === "EXCLUSIVE"
                ? "Single buyer takes it off the board."
                : "Multiple buyers can unlock this idea."}
            </p>
          </div>

          <div className="shrink-0">
            {isOwner ? (
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-border bg-muted px-5 text-sm"
              >
                <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
              </Button>
            ) : isPurchased ? (
              <Button
                asChild
                className="h-11 rounded-full bg-muted px-5 text-sm text-foreground hover:bg-muted/80"
              >
                <Link href={`/ideas/${id}`}>
                  <Unlock className="h-3.5 w-3.5" />
                  Open idea
                </Link>
              </Button>
            ) : (
              <Button asChild className="h-11 rounded-full px-5 text-sm">
                <Link href={`/ideas/${id}`}>
                  <Unlock className="h-3.5 w-3.5" />
                  Unlock
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Bot, Code, Flame, FlaskConical, Globe, Lightbulb, Lock, Map, Package, PenTool, Rocket, Sprout, Star, TrendingUp, Unlock, Users, Zap } from "lucide-react";
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

const categoryColors: Record<string, string> = {
  "Startup & Business": "bg-rose-500/15 text-rose-300 border border-rose-500/25",
  "Software & Tech":    "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25",
  "AI & Automation":    "bg-violet-500/15 text-violet-300 border border-violet-500/25",
  "Marketing & Growth": "bg-orange-500/15 text-orange-300 border border-orange-500/25",
  "Product & Design":   "bg-pink-500/15 text-pink-300 border border-pink-500/25",
  "Creative & Content": "bg-teal-500/15 text-teal-300 border border-teal-500/25",
};

const categoryIconMap: Record<string, React.ElementType> = {
  "Startup & Business": Rocket,
  "Software & Tech":    Code,
  "AI & Automation":    Bot,
  "Marketing & Growth": TrendingUp,
  "Product & Design":   Package,
  "Creative & Content": PenTool,
};

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
  maturityLevel,
  maxUnlocks,
  isOwner = false,
  isPurchased = false,
  initialBookmarked = false,
  isAuthenticated = false,
  isTrending = false,
  isCreatorVerified = false,
  creatorTier,
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

  const maturityConfig = {
    SEED: { label: "Seed", icon: <Sprout className="h-3 w-3" />, className: "bg-amber-500/15 text-amber-400 border border-amber-500/25" },
    CONCEPT: { label: "Concept", icon: <Lightbulb className="h-3 w-3" />, className: "bg-sky-500/15 text-sky-300 border border-sky-500/25" },
    BLUEPRINT: { label: "Blueprint", icon: <Map className="h-3 w-3" />, className: "bg-violet-500/15 text-violet-300 border border-violet-500/25" },
    PROTOTYPE_READY: { label: "Prototype-Ready", icon: <FlaskConical className="h-3 w-3" />, className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" },
  } as const;

  const spotsLeft = unlockType === "EXCLUSIVE" && maxUnlocks && maxUnlocks > 0
    ? maxUnlocks - (purchaseCount ?? 0)
    : null;

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
      <div className="relative h-44 overflow-hidden bg-[hsl(252,32%,6%)]">
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
            {/* Blurred teaser text */}
            {teaserText && (
              <div
                className="absolute inset-0 flex flex-col justify-center gap-[7px] px-5 py-6 select-none pointer-events-none"
                aria-hidden="true"
              >
                <p className="text-[12px] leading-[1.5] text-white/55 blur-[2.5px] line-clamp-1 w-full">
                  {teaserText}
                </p>
                <p className="text-[12px] leading-[1.5] text-white/40 blur-[3px] line-clamp-1 w-[88%]">
                  {teaserText}
                </p>
                <p className="text-[12px] leading-[1.5] text-white/28 blur-[3.5px] line-clamp-1 w-[70%]">
                  {teaserText}
                </p>
              </div>
            )}
            {/* Lock icon */}
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_24px_rgba(109,90,230,0.18)] backdrop-blur-sm">
              <Lock className="h-6 w-6 text-primary/60" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[hsl(252,28%,7%)] to-transparent" />
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
          {maturityLevel && (
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
                maturityConfig[maturityLevel].className
              )}
            >
              {maturityConfig[maturityLevel].icon}
              {maturityConfig[maturityLevel].label}
            </span>
          )}
          {!maturityLevel && category && categoryColors[category] && (() => {
            const CategoryIcon = categoryIconMap[category];
            const pillClass = cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
              categoryColors[category]
            );
            const pillContent = <>{CategoryIcon && <CategoryIcon className="h-3 w-3" />}{category}</>;
            return categorySlug ? (
              <Link href={`/ideas/category/${categorySlug}`} onClick={(e) => e.stopPropagation()} className={pillClass}>
                {pillContent}
              </Link>
            ) : (
              <span className={pillClass}>{pillContent}</span>
            );
          })()}
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm",
              unlockType === "EXCLUSIVE"
                ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_8px_rgba(109,90,230,0.20)]"
                : "bg-sky-500/20 text-sky-300 border border-sky-500/30"
            )}
          >
            {unlockType === "EXCLUSIVE" ? (
              <><Zap className="h-3 w-3" /> Exclusive</>
            ) : (
              <><Globe className="h-3 w-3" /> Open</>
            )}
          </span>
        </div>

        {/* Bookmark button — top-right corner */}
        {!isOwner && (
          <div className="absolute right-2.5 top-2.5">
            <BookmarkButton
              ideaId={id}
              initialBookmarked={initialBookmarked}
              isAuthenticated={isAuthenticated}
            />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="relative flex flex-1 flex-col p-4">
        {/* Creator row — prominent, at top of body */}
        {(creatorId || creatorName) && (
          <div className="mb-3 flex items-center gap-2.5">
            <Link
              href={creatorId ? `/profile/${creatorId}` : "#"}
              onClick={(e) => !creatorId && e.preventDefault()}
              className="shrink-0"
            >
              <Avatar className="h-8 w-8 ring-1 ring-white/10 transition-opacity hover:opacity-80">
                <AvatarImage src={normalizedCreatorAvatarUrl ?? undefined} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{creatorInitials}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={creatorId ? `/profile/${creatorId}` : "#"}
                onClick={(e) => !creatorId && e.preventDefault()}
                className="block truncate text-[13px] font-semibold text-white/85 hover:text-primary transition-colors"
              >
                {creatorName ?? "Creator"}
              </Link>
              {(creatorTier || isCreatorVerified) && (
                <div className="mt-0.5 flex items-center gap-1.5">
                  {creatorTier && (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-primary/70">
                      {creatorTier}
                    </span>
                  )}
                  {creatorTier && isCreatorVerified && (
                    <span className="text-white/20">·</span>
                  )}
                  {isCreatorVerified && (
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-emerald-400/90">
                      <BadgeCheck className="h-3 w-3" />
                      verified
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Title */}
        <Link
          href={`/ideas/${id}`}
          className="text-sm font-bold leading-snug line-clamp-2 text-white/90 hover:text-primary transition-colors"
        >
          {title}
        </Link>

        {/* Teaser text */}
        {teaserText && (
          <p className="mt-2.5 text-[12px] leading-relaxed text-white/40 line-clamp-3">
            {teaserText}
          </p>
        )}

        {/* Stats chips row */}
        {((typeof averageRating === "number" && typeof reviewCount === "number" && reviewCount > 0) ||
          typeof purchaseCount === "number" ||
          (spotsLeft !== null && spotsLeft > 0)) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {typeof averageRating === "number" && typeof reviewCount === "number" && reviewCount > 0 && (
              <span
                className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-400"
                aria-label={`Rating: ${averageRating.toFixed(1)} out of 5 stars`}
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {averageRating.toFixed(1)}
                <span className="font-normal text-amber-400/60">({reviewCount})</span>
              </span>
            )}
            {typeof purchaseCount === "number" && (
              <span className="flex items-center gap-1 rounded-full bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/45">
                <Users className="h-3 w-3" />
                {purchaseCount} buyers
              </span>
            )}
            {spotsLeft !== null && spotsLeft > 0 && (
              <span className={cn(
                "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border",
                spotsLeft <= 3
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/25"
                  : "bg-white/[0.05] text-white/50 border-white/[0.08]"
              )}>
                <Users className="h-3 w-3" />
                {spotsLeft} of {maxUnlocks} left
              </span>
            )}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xl font-bold tracking-tight text-white/90">
              {formatPrice(priceInCents)}
            </span>
            {isOwner ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 px-5 text-xs rounded-xl border-white/10 bg-white/[0.03] text-white/50 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
              >
                <Link href={`/studio/ideas/${id}/edit`}>Edit</Link>
              </Button>
            ) : isPurchased ? (
              <Button
                asChild
                size="sm"
                className="h-9 px-5 text-xs rounded-xl bg-emerald-500/90 hover:bg-emerald-500 text-white shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
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
    </div>
  );
}

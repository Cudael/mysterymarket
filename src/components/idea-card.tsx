"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { IdeaCardProps } from "@/types";

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
  purchaseCount,
  isOwner = false,
  isPurchased = false,
}: IdeaCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:shadow-md">
      {/* Image / Placeholder */}
      <div className="relative h-48 w-full overflow-hidden border-b border-border bg-muted/50">
        {teaserImageUrl ? (
          <Image
            src={teaserImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Sparkles className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}

        {/* Lock overlay backdrop */}
        {!isPurchased && !isOwner && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/20 backdrop-blur-[2px]">
            <div className="rounded-full border border-border bg-background/90 p-3 shadow-sm">
              <Lock className="h-5 w-5 text-foreground" />
            </div>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute left-4 top-4 z-20">
            <Badge variant="secondary" className="bg-background/90 font-medium shadow-sm backdrop-blur-md hover:bg-background">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>

        {teaserText && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {teaserText}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <Badge
            variant={unlockType === "EXCLUSIVE" ? "default" : "secondary"}
            className="rounded-md px-2 py-0.5 text-xs font-medium"
          >
            {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
          </Badge>
          {purchaseCount !== undefined && purchaseCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {purchaseCount}
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(priceInCents)}
            </span>
            {creatorName && (
              <span className="text-xs text-muted-foreground">
                by{" "}
                {creatorId ? (
                  <Link
                    href={`/creators/${creatorId}`}
                    className="font-medium hover:text-foreground hover:underline underline-offset-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {creatorName}
                  </Link>
                ) : (
                  creatorName
                )}
              </span>
            )}
          </div>

          {isOwner ? (
            <Button asChild variant="outline" size="sm" className="h-8 px-4">
              <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
            </Button>
          ) : isPurchased ? (
            <Button asChild variant="secondary" size="sm" className="h-8 px-4">
              <Link href={`/ideas/${id}`}>View Content</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="h-8 px-4 gap-1.5">
              <Link href={`/ideas/${id}`}>
                <Lock className="h-3 w-3" />
                Unlock
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

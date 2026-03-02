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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
      
      {/* Decorative top color bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500 z-20 opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Image / Vibrant Placeholder */}
      <div className="relative h-48 w-full overflow-hidden border-b border-border/50">
        {teaserImageUrl ? (
          <Image
            src={teaserImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <Sparkles className="h-10 w-10 text-primary/40 relative z-10 transition-transform duration-500 group-hover:scale-125 group-hover:text-primary" />
          </div>
        )}

        {/* Lock overlay backdrop with creative styling */}
        {!isPurchased && !isOwner && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] transition-all duration-300 group-hover:backdrop-blur-0 group-hover:bg-transparent">
            <div className="rounded-full border border-white/20 bg-black/60 p-3.5 shadow-2xl backdrop-blur-md text-white transition-transform duration-300 group-hover:scale-110">
              <Lock className="h-5 w-5" />
            </div>
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute left-4 top-4 z-20">
            <Badge variant="secondary" className="bg-white/90 text-slate-800 font-bold shadow-sm backdrop-blur-md hover:bg-white border-0">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>

        {teaserText && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {teaserText}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <Badge
            variant={unlockType === "EXCLUSIVE" ? "default" : "secondary"}
            className="rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 border-0"
          >
            {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
          </Badge>
          {purchaseCount !== undefined && purchaseCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <Users className="h-4 w-4 text-slate-400" />
              {purchaseCount}
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-foreground">
              {formatPrice(priceInCents)}
            </span>
            {creatorName && (
              <span className="text-sm text-muted-foreground mt-0.5">
                by{" "}
                {creatorId ? (
                  <Link
                    href={`/creators/${creatorId}`}
                    className="font-bold text-foreground hover:text-primary transition-colors"
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
            <Button asChild variant="outline" className="rounded-full px-6 font-bold border-slate-300">
              <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
            </Button>
          ) : isPurchased ? (
            <Button asChild variant="secondary" className="rounded-full px-6 font-bold bg-primary/10 text-primary hover:bg-primary/20">
              <Link href={`/ideas/${id}`}>Read Now</Link>
            </Button>
          ) : (
            <Button asChild className="rounded-full px-6 font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all gap-2">
              <Link href={`/ideas/${id}`}>
                <Lock className="h-3.5 w-3.5" />
                Unlock
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

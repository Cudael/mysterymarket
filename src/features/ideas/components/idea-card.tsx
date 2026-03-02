"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
}: IdeaCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#6D7BE0]/40">
      
      {/* Image / Subtle Placeholder */}
      <div className="relative h-48 w-full overflow-hidden border-b border-[#D9DCE3] bg-[#F5F6FA]">
        {teaserImageUrl ? (
          <Image
            src={teaserImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {/* Minimalist icon for missing images */}
            <Lock className="h-8 w-8 text-[#D9DCE3]" />
          </div>
        )}

        {/* Category badge */}
        {category && (
          <div className="absolute left-4 top-4 z-20">
            <span className="inline-flex items-center rounded-[6px] bg-[#FFFFFF] px-2.5 py-1 text-xs font-medium text-[#1A1A1A] shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-[#D9DCE3]">
              {category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-[18px] font-bold tracking-tight text-[#1A1A1A]">
          {title}
        </h3>

        {teaserText && (
          <p className="mt-3 line-clamp-2 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
            {teaserText}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-medium border ${
              unlockType === "EXCLUSIVE"
                ? "bg-[#E8C26A]/10 text-[#1A1A1A] border-[#E8C26A]/30"
                : "bg-[#F5F6FA] text-[#1A1A1A] border-[#D9DCE3]"
            }`}
          >
            {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
          </span>
          {purchaseCount !== undefined && purchaseCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-[#1A1A1A]/60">
              <Users className="h-3.5 w-3.5" />
              {purchaseCount} unlocked
            </span>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#D9DCE3] pt-5">
          <div className="flex flex-col">
            <span className="text-[20px] font-bold text-[#1A1A1A]">
              {formatPrice(priceInCents)}
            </span>
            {creatorName && (
              <div className="mt-1 flex items-center gap-2">
                {creatorAvatarUrl ? (
                  <Image 
                    src={creatorAvatarUrl} 
                    alt={creatorName} 
                    width={18} 
                    height={18} 
                    className="rounded-full border border-[#D9DCE3]"
                  />
                ) : (
                  <div className="h-[18px] w-[18px] rounded-full bg-[#D9DCE3]" />
                )}
                {creatorId ? (
                  <Link
                    href={`/creators/${creatorId}`}
                    className="text-sm font-medium text-[#1A1A1A]/70 hover:text-[#3A5FCD] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {creatorName}
                  </Link>
                ) : (
                  <span className="text-sm text-[#1A1A1A]/70">{creatorName}</span>
                )}
              </div>
            )}
          </div>

          {isOwner ? (
            <Button asChild variant="outline" size="sm" className="h-9 px-4">
              <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
            </Button>
          ) : isPurchased ? (
            <Button asChild variant="secondary" size="sm" className="h-9 px-4">
              <Link href={`/ideas/${id}`}>Read Now</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="h-9 px-4 gap-1.5">
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

"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface PurchaseTimelineProps {
  purchases: Array<{
    id: string;
    ideaTitle: string;
    category: string | null;
    creatorName: string | null;
    amountInCents: number;
    date: string | Date;
  }>;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PurchaseTimeline({ purchases }: PurchaseTimelineProps) {
  if (purchases.length === 0) {
    return (
      <p className="text-[14px] text-muted-foreground py-4">
        No purchases yet. Browse the marketplace to get started!
      </p>
    );
  }

  return (
    <div className="relative flex flex-col">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-3 bottom-3 w-px bg-border" />

      {purchases.map((purchase, i) => (
        <div key={`${purchase.id}-${i}`} className="relative flex gap-4 pb-6 last:pb-0">
          {/* Dot */}
          <div className="relative mt-1 flex h-4 w-4 shrink-0 items-center justify-center">
            <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/ideas/${purchase.id}`}
                  className="text-[14px] font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                >
                  {purchase.ideaTitle}
                </Link>
                {purchase.creatorName && (
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    by {purchase.creatorName}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-bold text-foreground">
                  {formatPrice(purchase.amountInCents)}
                </p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                  {formatDate(purchase.date)}
                </p>
              </div>
            </div>
            {purchase.category && (
              <span className="mt-1.5 inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {purchase.category}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

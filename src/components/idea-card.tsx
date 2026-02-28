import Link from "next/link";
import Image from "next/image";
import { Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Image / Gradient Placeholder */}
      <div className="relative h-40 w-full overflow-hidden">
        {teaserImageUrl ? (
          <Image
            src={teaserImageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 via-purple-500/10 to-background" />
        )}
        {/* Lock overlay */}
        {!isPurchased && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-primary/30 bg-background/60 p-3 backdrop-blur-sm">
              <Lock className="h-5 w-5 text-primary" />
            </div>
          </div>
        )}
        {/* Category badge */}
        {category && (
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 pt-4">
        <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
          {title}
        </h3>

        {teaserText && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {teaserText}
          </p>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Badge
            variant={unlockType === "EXCLUSIVE" ? "default" : "secondary"}
            className="text-xs"
          >
            {unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
          </Badge>
          {purchaseCount !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {purchaseCount}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(priceInCents)}
          </span>
          {creatorName && (
            creatorId ? (
              <Link
                href={`/creators/${creatorId}`}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                by {creatorName}
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">
                by {creatorName}
              </span>
            )
          )}
        </div>

        {isOwner ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/creator/ideas/${id}/edit`}>Edit</Link>
          </Button>
        ) : isPurchased ? (
          <Button asChild variant="secondary" size="sm">
            <Link href={`/ideas/${id}`}>View</Link>
          </Button>
        ) : (
          <Button asChild size="sm" className="gap-1">
            <Link href={`/ideas/${id}`}>
              <Lock className="h-3 w-3" />
              Unlock
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

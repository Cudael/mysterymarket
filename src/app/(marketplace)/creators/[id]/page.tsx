import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  Calendar,
  Lightbulb,
  ShoppingBag,
  BadgeCheck,
  Star,
  Globe,
  Linkedin,
  ExternalLink,
  Users,
  Flame,
  Trophy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { FollowButton } from "@/features/follows/components/follow-button";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, bio: true },
  });
  if (!user) return { title: "Creator Not Found" };
  return {
    title: `${user.name ?? "Creator"} - MysteryMarket`,
    description:
      user.bio ??
      `Browse high-value ideas by ${user.name ?? "this creator"} on MysteryMarket.`,
  };
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId: clerkUserId } = await auth();

  const [user, reviewAgg, revenueAgg, followerCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        ideas: {
          where: { published: true },
          include: { _count: { select: { purchases: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.review.aggregate({
      where: { idea: { creatorId: id } },
      _avg: { rating: true },
      _count: { id: true },
    }),
    prisma.purchase.aggregate({
      where: { idea: { creatorId: id }, status: "COMPLETED" },
      _sum: { amountInCents: true },
    }),
    prisma.follow.count({ where: { followingId: id } }),
  ]);

  if (!user || user.ideas.length === 0) notFound();

  // Check if current viewer is following this creator
  let isFollowing = false;
  let isSelf = false;
  if (clerkUserId) {
    const viewer = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    });
    if (viewer) {
      isSelf = viewer.id === id;
      if (!isSelf) {
        const follow = await prisma.follow.findUnique({
          where: {
            followerId_followingId: { followerId: viewer.id, followingId: id },
          },
        });
        isFollowing = !!follow;
      }
    }
  }

  const totalSales = user.ideas.reduce(
    (sum, idea) => sum + idea._count.purchases,
    0
  );
  const totalRevenueInCents = revenueAgg._sum.amountInCents ?? 0;
  const avgRating = reviewAgg._avg.rating;
  const reviewCount = reviewAgg._count.id;

  // Derive category specialization from published ideas
  const categoryCounts = user.ideas.reduce<Record<string, number>>((acc, idea) => {
    if (idea.category) {
      acc[idea.category] = (acc[idea.category] ?? 0) + 1;
    }
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat);

  // Trust badges
  const isTopRated = avgRating != null && Number(avgRating) >= 4.5 && reviewCount >= 3;
  const isPopularCreator = totalSales >= 10;

  const initials = (user.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Creator Profile Header Card */}
      <div className="mb-12 rounded-[12px] border border-border bg-card p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="h-24 w-24 shrink-0 border-2 border-border shadow-sm">
            <AvatarImage
              src={user.avatarUrl ?? undefined}
              alt={user.name ?? "Creator"}
            />
            <AvatarFallback className="bg-muted text-primary text-2xl font-bold border border-border">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/* Name + Verified Badge */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-[32px] font-bold tracking-tight text-foreground">
                {user.name ?? "Anonymous"}
              </h1>
              {user.stripeOnboarded && (
                <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-primary/20 bg-primary/10 px-2.5 py-1 text-[12px] font-semibold text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified Creator
                </span>
              )}
              {isTopRated && (
                <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-amber-300/40 bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-700">
                  <Trophy className="h-3.5 w-3.5" />
                  Top Rated
                </span>
              )}
              {isPopularCreator && (
                <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-orange-300/40 bg-orange-50 px-2.5 py-1 text-[12px] font-semibold text-orange-700">
                  <Flame className="h-3.5 w-3.5" />
                  Popular Creator
                </span>
              )}
            </div>

            {user.bio && (
              <p className="mt-3 max-w-2xl text-[16px] leading-[1.6] text-foreground/70">
                {user.bio}
              </p>
            )}

            {/* Social Links */}
            {(user.twitterUrl || user.linkedinUrl || user.websiteUrl) && (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                {user.twitterUrl && (
                  <a
                    href={user.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Twitter
                  </a>
                )}
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                {user.websiteUrl && (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            )}

            {/* Category Specialization */}
            {topCategories.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="text-[12px] font-semibold uppercase tracking-wider text-foreground/40">Specializes in</span>
                {topCategories.map((cat) => (
                  <span key={cat} className="inline-flex items-center rounded-[6px] border border-primary/20 bg-primary/5 px-2.5 py-1 text-[12px] font-medium text-primary">
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Stats Row */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start">
              <span className="flex items-center gap-2 rounded-[6px] bg-muted border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                <Calendar className="h-4 w-4 text-foreground/50" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2 rounded-[6px] bg-muted border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                <Lightbulb className="h-4 w-4 text-primary" />
                {user.ideas.length} idea{user.ideas.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-2 rounded-[6px] bg-muted border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
                {totalSales} sale{totalSales !== 1 ? "s" : ""}
              </span>
              {totalRevenueInCents > 0 && (
                <span className="flex items-center gap-2 rounded-[6px] bg-muted border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                  <ShoppingBag className="h-4 w-4 text-foreground/50" />
                  {formatPrice(totalRevenueInCents)} total sales value
                </span>
              )}
              <span className="flex items-center gap-2 rounded-[6px] bg-muted border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                <Users className="h-4 w-4 text-foreground/50" />
                {followerCount} follower{followerCount !== 1 ? "s" : ""}
              </span>
              {avgRating != null && reviewCount > 0 && (
                <span className="flex items-center gap-2 rounded-[6px] bg-muted border border-border px-3 py-1.5 text-[13px] font-medium text-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(avgRating).toFixed(1)}
                  <span className="text-muted-foreground">
                    ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                  </span>
                </span>
              )}
            </div>

            {/* Follow Button */}
            {!isSelf && (
              <div className="mt-6 flex justify-center sm:justify-start">
                <FollowButton
                  creatorId={id}
                  initialFollowing={isFollowing}
                  initialFollowerCount={followerCount}
                  isAuthenticated={!!clerkUserId}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ideas grid */}
      <div>
        <h2 className="mb-6 text-[22px] font-bold tracking-tight text-foreground">
          Ideas by {user.name?.split(" ")[0] ?? "this creator"}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user.ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              id={idea.id}
              title={idea.title}
              teaserText={idea.teaserText}
              teaserImageUrl={idea.teaserImageUrl}
              priceInCents={idea.priceInCents}
              unlockType={idea.unlockType}
              category={idea.category}
              creatorId={user.id}
              creatorName={user.name}
              purchaseCount={idea._count.purchases}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

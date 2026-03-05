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

  const initials = (user.name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Creator Profile Header Card */}
      <div className="mb-12 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-8 sm:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="h-24 w-24 shrink-0 border-2 border-[#F8F9FC] shadow-sm">
            <AvatarImage
              src={user.avatarUrl ?? undefined}
              alt={user.name ?? "Creator"}
            />
            <AvatarFallback className="bg-[#F8F9FC] text-[#3A5FCD] text-2xl font-bold border border-[#D9DCE3]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            {/* Name + Verified Badge */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-[32px] font-bold tracking-tight text-[#1A1A1A]">
                {user.name ?? "Anonymous"}
              </h1>
              {user.stripeOnboarded && (
                <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#3A5FCD]/20 bg-[#3A5FCD]/10 px-2.5 py-1 text-[12px] font-semibold text-[#3A5FCD]">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified Creator
                </span>
              )}
            </div>

            {user.bio && (
              <p className="mt-3 max-w-2xl text-[16px] leading-[1.6] text-[#1A1A1A]/70">
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
                    className="flex items-center gap-1.5 text-[13px] text-[#1A1A1A]/50 hover:text-[#3A5FCD] transition-colors"
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
                    className="flex items-center gap-1.5 text-[13px] text-[#1A1A1A]/50 hover:text-[#3A5FCD] transition-colors"
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
                    className="flex items-center gap-1.5 text-[13px] text-[#1A1A1A]/50 hover:text-[#3A5FCD] transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            )}

            {/* Stats Row */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 sm:justify-start">
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <Calendar className="h-4 w-4 text-[#1A1A1A]/50" />
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <Lightbulb className="h-4 w-4 text-[#3A5FCD]" />
                {user.ideas.length} idea{user.ideas.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <ShoppingBag className="h-4 w-4 text-[#054F31]" />
                {totalSales} sale{totalSales !== 1 ? "s" : ""}
              </span>
              {totalRevenueInCents > 0 && (
                <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                  <ShoppingBag className="h-4 w-4 text-[#1A1A1A]/50" />
                  {formatPrice(totalRevenueInCents)} total sales value
                </span>
              )}
              <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                <Users className="h-4 w-4 text-[#1A1A1A]/50" />
                {followerCount} follower{followerCount !== 1 ? "s" : ""}
              </span>
              {avgRating != null && reviewCount > 0 && (
                <span className="flex items-center gap-2 rounded-[6px] bg-[#F8F9FC] border border-[#D9DCE3] px-3 py-1.5 text-[13px] font-medium text-[#1A1A1A]">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(avgRating).toFixed(1)}
                  <span className="text-[#1A1A1A]/50">
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
        <h2 className="mb-6 text-[22px] font-bold tracking-tight text-[#1A1A1A]">
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

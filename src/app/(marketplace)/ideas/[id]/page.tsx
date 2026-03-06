import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, Calendar, Users, ShieldCheck, RefreshCw, Wallet, Star, CheckCircle2, FileText, Lightbulb } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnlockButton } from "@/features/purchases/components/unlock-button";
import { BookmarkButton } from "@/features/bookmarks/components/bookmark-button";
import { ShareButtons } from "@/components/shared/share-buttons";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ReviewList } from "@/features/reviews/components/review-list";
import { ReviewForm } from "@/features/reviews/components/review-form";
import { ReportDialog } from "@/features/reports/components/report-dialog";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { CATEGORY_META } from "@/lib/constants";
import { getIdeaById } from "@/features/ideas/actions";
import { trackEvent } from "@/lib/analytics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const idea = await getIdeaById(id);
  if (!idea) return { title: "Idea Not Found" };
  return {
    title: idea.title,
    description:
      idea.teaserText || `Unlock this idea for ${formatPrice(idea.priceInCents)}`,
  };
}

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId: clerkId } = await auth();

  const idea = await prisma.idea.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, avatarUrl: true, createdAt: true } },
      _count: { select: { purchases: true, reviews: true } },
    },
  });

  if (!idea) notFound();

  // Only show published ideas, or unpublished if the viewer is the creator
  let currentUser = null;
  if (clerkId) {
    currentUser = await prisma.user.findUnique({ where: { clerkId } });
  }

  const isOwner = currentUser?.id === idea.creatorId;
  if (!idea.published && !isOwner) notFound();

  // Check if the current user has purchased
  let isPurchased = false;
  let hasReviewed = false;
  let isBookmarked = false;
  if (currentUser && !isOwner) {
    const [purchase, bookmark] = await Promise.all([
      prisma.purchase.findUnique({
        where: { buyerId_ideaId: { buyerId: currentUser.id, ideaId: id } },
      }),
      prisma.bookmark.findUnique({
        where: { userId_ideaId: { userId: currentUser.id, ideaId: id } },
      }),
    ]);
    isPurchased = purchase?.status === "COMPLETED";
    isBookmarked = !!bookmark;
    if (isPurchased) {
      const existing = await prisma.review.findUnique({
        where: { buyerId_ideaId: { buyerId: currentUser.id, ideaId: id } },
      });
      hasReviewed = !!existing;
    }
  }

  // Check if exclusive idea has already been claimed
  const exclusiveClaimed =
    idea.unlockType === "EXCLUSIVE" && idea._count.purchases > 0 && !isPurchased;

  // Fetch wallet balance, creator stats, review aggregate, and similar ideas in parallel
  const [
    creatorPublishedCount,
    creatorTotalSales,
    reviewAggregate,
    wallet,
    similarIdeas,
  ] = await Promise.all([
    prisma.idea.count({ where: { creatorId: idea.creatorId, published: true } }),
    prisma.purchase.count({ where: { idea: { creatorId: idea.creatorId }, status: "COMPLETED" } }),
    prisma.review.aggregate({ where: { ideaId: id }, _avg: { rating: true } }),
    currentUser && !isOwner
      ? prisma.wallet.findUnique({
          where: { userId: currentUser.id },
          select: { balanceInCents: true },
        })
      : Promise.resolve(null),
    prisma.idea.findMany({
      where: {
        published: true,
        id: { not: id },
        ...(idea.category ? { category: idea.category } : {}),
      },
      select: {
        id: true,
        title: true,
        priceInCents: true,
        category: true,
        creator: { select: { name: true } },
        _count: { select: { purchases: true } },
      },
      orderBy: { purchases: { _count: "desc" } },
      take: 3,
    }),
  ]);

  const walletBalance = wallet?.balanceInCents ?? null;
  const avgRating = reviewAggregate._avg.rating;

  const showContent = isOwner || isPurchased;

  trackEvent("idea_viewed", {
    ideaId: idea.id,
    viewerId: currentUser?.id,
    isOwner,
    isPurchased,
  });

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Ideas", href: "/ideas" },
          { label: idea.title },
        ]}
      />
      <Link
        href="/ideas"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Ideas
      </Link>

      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Teaser image */}
            {idea.teaserImageUrl && (
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl">
                <Image
                  src={idea.teaserImageUrl}
                  alt={idea.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant={idea.unlockType === "EXCLUSIVE" ? "default" : "secondary"}>
                {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-unlock"}
              </Badge>
              {idea.category && (
                <Badge variant="outline">{idea.category}</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-foreground">{idea.title}</h1>

            <div className="mt-3 flex items-center gap-2">
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_APP_URL}/ideas/${id}`}
                title={idea.title}
              />
              {!isOwner && (
                <BookmarkButton
                  ideaId={id}
                  initialBookmarked={isBookmarked}
                  isAuthenticated={!!clerkId}
                  size="md"
                />
              )}
              {clerkId && !isOwner && (
                <ReportDialog ideaId={id} />
              )}
            </div>

            {idea.teaserText && (
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {idea.teaserText}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {idea._count.purchases} unlock{idea._count.purchases !== 1 ? "s" : ""}
              </span>
              {avgRating !== null && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)} ({idea._count.reviews} review{idea._count.reviews !== 1 ? "s" : ""})
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(idea.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* What you'll get — shown only to non-purchasers, non-owners */}
            {!showContent && !exclusiveClaimed && (
              <div className="mt-8 rounded-xl border border-border bg-card p-5">
                <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-foreground">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  What you&apos;ll get
                </h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>Full access to the complete hidden idea — revealed instantly after unlock</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>Lifetime access — revisit this idea any time from your dashboard</span>
                  </li>
                  {idea.unlockType === "EXCLUSIVE" && (
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      <span>Exclusive rights — only one buyer ever gets this idea</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Option to leave a review and share your experience with others</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Hidden content section */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                The Idea
              </h2>

              {showContent ? (
                <div className="rounded-xl border border-border bg-card p-6">
                  <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                    {idea.hiddenContent}
                  </p>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-xl border border-border bg-card">
                  {/* Blurred preview */}
                  <div className="select-none blur-sm p-6 pointer-events-none">
                    <p className="text-foreground leading-relaxed">
                      {idea.hiddenContent.substring(0, 200)}
                      {idea.hiddenContent.length > 200 ? "..." : ""}
                    </p>
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 mb-3">
                      <Lock className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exclusiveClaimed
                        ? "This idea has been claimed"
                        : `Unlock to reveal the full idea`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reviews section */}
            <ReviewList ideaId={id} />
            {isPurchased && !hasReviewed && <ReviewForm ideaId={id} />}

            {/* What's next — shown after purchase */}
            {isPurchased && similarIdeas.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h2 className="mb-1 text-base font-semibold text-foreground">
                  {idea.category ? `More ${idea.category} insights` : "You might also like"}
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">Keep exploring ideas in this category</p>
                <div className="flex flex-col gap-3">
                  {similarIdeas.map((sim) => (
                    <Link
                      key={sim.id}
                      href={`/ideas/${sim.id}`}
                      className="group flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {sim.title}
                        </p>
                        {sim.creator.name && (
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">by {sim.creator.name}</p>
                        )}
                      </div>
                      <span className="ml-3 shrink-0 text-sm font-bold text-primary">{formatPrice(sim.priceInCents)}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href={idea.category && CATEGORY_META[idea.category] ? `/ideas/category/${CATEGORY_META[idea.category].slug}` : "/ideas"}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Browse all {idea.category ? `${idea.category} ` : ""}ideas →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Price & unlock card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-1 text-center">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(idea.priceInCents)}
                </span>
                {idea.unlockType === "EXCLUSIVE" ? (
                  <p className="mt-1 text-xs text-muted-foreground">One-time exclusive unlock</p>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">One-time purchase · lifetime access</p>
                )}
              </div>

              {/* Rating summary near CTA */}
              {avgRating !== null && (
                <div className="mb-4 mt-3 flex items-center justify-center gap-1.5 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${
                        star <= Math.round(avgRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    {avgRating.toFixed(1)} · {idea._count.reviews} review{idea._count.reviews !== 1 ? "s" : ""}
                  </span>
                </div>
              )}

              <UnlockButton
                ideaId={id}
                priceInCents={idea.priceInCents}
                isExclusive={idea.unlockType === "EXCLUSIVE"}
                isPurchased={isPurchased}
                isAuthenticated={!!clerkId}
                isOwner={isOwner}
                exclusiveClaimed={exclusiveClaimed}
                walletBalance={walletBalance}
              />

              {/* Reassurance cues */}
              {!isOwner && !isPurchased && !exclusiveClaimed && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-green-500" />
                    Secure checkout powered by Stripe
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wallet className="h-3.5 w-3.5 shrink-0 text-primary" />
                    Pay with wallet balance or card
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    Not satisfied? Refund requests accepted
                  </div>
                </div>
              )}
            </div>

            {/* Creator credibility card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Creator
              </h3>
              <Link
                href={`/creators/${idea.creator.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {idea.creator.avatarUrl ? (
                  <Image
                    src={idea.creator.avatarUrl}
                    alt={idea.creator.name ?? "Creator"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                    {(idea.creator.name ?? "?")[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {idea.creator.name ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">View profile →</p>
                </div>
              </Link>

              {/* Creator stats */}
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{creatorPublishedCount}</p>
                  <p className="text-xs text-muted-foreground">Ideas published</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{creatorTotalSales}</p>
                  <p className="text-xs text-muted-foreground">Total unlocks</p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Member since{" "}
                {new Date(idea.creator.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            {isOwner && (
              <Button asChild variant="outline">
                <Link href={`/creator/ideas/${id}/edit`}>Edit Idea</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

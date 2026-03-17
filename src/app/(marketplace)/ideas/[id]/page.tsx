import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, CheckCircle2, Calendar, FileText, Lightbulb, Lock, RefreshCw, ShieldCheck, Star, Wallet, Users } from "lucide-react";
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
import { cn, formatPrice } from "@/lib/utils";
import { CATEGORY_META, IDEA_MATURITY_LEVELS } from "@/lib/constants";
import { getIdeaById } from "@/features/ideas/actions";
import { trackEvent } from "@/lib/analytics";
import { getRelatedIdeas, getRisingIdeas } from "@/features/ideas/lib/discovery";

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
      creator: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          stripeOnboarded: true,
        },
      },
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
    relatedIdeas,
    risingIdeas,
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
    getRelatedIdeas({
      ideaId: id,
      category: idea.category,
      subcategoryId: idea.subcategoryId,
      tags: idea.tags,
    }),
    getRisingIdeas({ excludeIds: [id], take: 3, category: idea.category }),
  ]);

  const walletBalance = wallet?.balanceInCents ?? null;
  const avgRating = reviewAggregate._avg.rating;
  const maturityConfig = IDEA_MATURITY_LEVELS.find((level) => level.value === idea.maturityLevel);
  const rightsSummary =
    idea.unlockType === "EXCLUSIVE"
      ? {
          label: "Exclusive unlock",
          copy:
            "One buyer can unlock this listing on MysteryMarket. We mark it as claimed after purchase, but this does not by itself assign legal IP rights.",
          deliverable: "Instant access to the creator's full private write-up and supporting notes.",
        }
      : {
          label: "Multi-unlock access",
          copy:
            "Multiple buyers can unlock this listing. Your purchase gives you access to the creator's full write-up inside your library.",
          deliverable: "Instant access to the full write-up with lifetime re-reading on MysteryMarket.",
        };
  const previewSections = [
    idea.whatYoullGet
      ? {
          title: "What you'll get",
          body: idea.whatYoullGet,
        }
      : {
          title: "What you'll get",
          body: rightsSummary.deliverable,
        },
    idea.bestFitFor
      ? {
          title: "Best fit for",
          body: idea.bestFitFor,
        }
      : null,
    maturityConfig
      ? {
          title: "Readiness",
          body: `${maturityConfig.label} — ${maturityConfig.description}`,
        }
      : null,
    idea.implementationNotes
      ? {
          title: "Risks / notes",
          body: idea.implementationNotes,
        }
      : null,
  ].filter((section): section is { title: string; body: string } => Boolean(section));

  const showContent = isOwner || isPurchased;
  const exclusiveSpotsLeft = idea.unlockType === "EXCLUSIVE" && idea.maxUnlocks
    ? idea.maxUnlocks - idea._count.purchases
    : null;

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
              <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
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
              {idea.originalityConfirmed && (
                <Badge
                  variant="outline"
                  className="border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                >
                  <BadgeCheck className="mr-1 h-3 w-3" />
                  Originality attested
                </Badge>
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

            <div className="mt-8 rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Preview before you unlock
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Clear framing helps buyers understand the value before the full idea is revealed.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{rightsSummary.label}</p>
                  <p className="mt-1 max-w-[240px]">{rightsSummary.copy}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {previewSections.map((section) => (
                  <div key={section.title} className="rounded-lg border border-border bg-muted p-4">
                    <p className="text-sm font-semibold text-foreground">{section.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{section.body}</p>
                  </div>
                ))}
              </div>

              {!showContent && !exclusiveClaimed && (
                <ul className="mt-5 space-y-2 border-t border-border pt-5">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{rightsSummary.deliverable}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>Lifetime access in your library after purchase.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>Refund requests are reviewed for listings that feel materially misleading.</span>
                  </li>
                </ul>
              )}
            </div>

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
                <div className="rounded-2xl border border-border bg-card p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">This idea is locked</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                    {exclusiveClaimed
                      ? "This exclusive idea has already been claimed."
                      : "Purchase to reveal the full concept, execution plan, and creator insights."}
                  </p>
                  {exclusiveClaimed && (
                    <p className="mt-2 text-sm font-medium text-destructive">
                      This exclusive idea has already been claimed
                    </p>
                  )}
                  <div className="mt-6 space-y-2 select-none pointer-events-none" aria-hidden="true">
                    <div className="h-3 w-full rounded-full bg-muted blur-sm" />
                    <div className="h-3 w-5/6 rounded-full bg-muted blur-sm" />
                    <div className="h-3 w-4/5 rounded-full bg-muted/70 blur-sm" />
                    <div className="h-3 w-3/4 rounded-full bg-muted/50 blur-sm" />
                  </div>
                </div>
              )}
            </div>

            {relatedIdeas.length > 0 && (
              <div className="mt-8 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--gold))]/70">
                  Related ideas
                </p>
                <h2 className="mb-1 text-base font-semibold text-white/85">
                  {idea.category ? `More in ${idea.category}` : "You might also like"}
                </h2>
                <p className="mb-4 text-xs text-white/45">
                  Ranked by shared category, subcategory, and tags.
                </p>
                <div className="flex flex-col gap-3">
                  {relatedIdeas.map((sim) => (
                    <Link
                      key={sim.id}
                      href={`/ideas/${sim.id}`}
                      className="group flex items-center justify-between rounded-[18px] border border-white/[0.08] bg-white/[0.03] px-4 py-3 transition-all hover:border-primary/20 hover:bg-white/[0.05]"
                    >
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-medium text-white/85 group-hover:text-primary transition-colors">
                          {sim.title}
                        </p>
                        {sim.creator.name && (
                          <p className="mt-0.5 text-xs text-white/45 truncate">
                            by {sim.creator.name}
                            {sim.originalityConfirmed ? " · attested" : ""}
                          </p>
                        )}
                      </div>
                      <span className="ml-3 shrink-0 text-sm font-bold text-[hsl(var(--gold))]">{formatPrice(sim.priceInCents)}</span>
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

            {risingIdeas.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
                  Rising now
                </p>
                <h2 className="mt-1 text-base font-semibold text-foreground">
                  Fresh listings buyers are already unlocking
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {risingIdeas.map((rising) => (
                    <Link
                      key={rising.id}
                      href={`/ideas/${rising.id}`}
                      className="rounded-lg border border-border bg-muted p-4 transition-colors hover:border-primary/30 hover:bg-card"
                    >
                      <p className="line-clamp-2 text-sm font-semibold text-foreground">
                        {rising.title}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {rising._count.purchases} unlock{rising._count.purchases !== 1 ? "s" : ""}
                        {rising.originalityConfirmed ? " · attested" : ""}
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[hsl(var(--gold))]">
                        {formatPrice(rising.priceInCents)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews section */}
            <ReviewList ideaId={id} />
            {isPurchased && !hasReviewed && <ReviewForm ideaId={id} />}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Price & unlock card */}
            <div className={cn(
              "rounded-xl border border-border bg-card p-6",
              !isPurchased && !isOwner && "shadow-[var(--shadow-primary-glow)]"
            )}>
              <div className="mb-1 text-center">
                <span className="text-3xl font-bold text-[hsl(var(--gold))]">
                  {formatPrice(idea.priceInCents)}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">{rightsSummary.label}</p>
              </div>

              <div className="mt-4 rounded-lg border border-border bg-muted p-4 text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
                  Purchase summary
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {rightsSummary.deliverable}
                </p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {rightsSummary.copy}
                </p>
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

              {/* Spots remaining — EXCLUSIVE with maxUnlocks */}
              {exclusiveSpotsLeft !== null && !isPurchased && !isOwner && (
                exclusiveSpotsLeft <= 0 ? (
                  <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                    <Users className="h-3.5 w-3.5" />
                    All spots claimed
                  </div>
                ) : (
                  <div className={cn(
                    "mt-3 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold",
                    exclusiveSpotsLeft <= 3
                      ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
                      : "border-white/[0.08] bg-white/[0.03] text-white/50"
                  )}>
                    <Users className="h-3.5 w-3.5" />
                    {exclusiveSpotsLeft} of {idea.maxUnlocks} spots remaining
                  </div>
                )
              )}

              {/* Reassurance cues */}
              {!isOwner && !isPurchased && !exclusiveClaimed && (
                <div className="mt-4 space-y-2 border-t border-border pt-4">
                  {idea.originalityConfirmed && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      Creator attested this listing is original or properly owned
                    </div>
                  )}
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
                    Refund requests are reviewed when the delivered write-up feels materially misleading
                  </div>
                </div>
              )}
            </div>

            {/* Creator credibility card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Creator
              </h3>
              <div className="rounded-xl bg-muted p-4">
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
                    <p className="text-xs text-muted-foreground">
                      View profile →
                      {idea.originalityConfirmed ? " · originality attested" : ""}
                    </p>
                  </div>
                </Link>
              </div>

              {(idea.originalityConfirmed || idea.creator.stripeOnboarded) && (
                <div className="mt-4 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
                  {idea.originalityConfirmed && (
                    <p className="flex items-center gap-2">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                      Public trust signal: originality attested by the creator
                    </p>
                  )}
                  {idea.creator.stripeOnboarded && (
                    <p className={cn("flex items-center gap-2", idea.originalityConfirmed && "mt-2")}>
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                      Creator has completed payout onboarding
                    </p>
                  )}
                </div>
              )}

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

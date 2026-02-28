import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock, Calendar, Users } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UnlockButton } from "@/components/unlock-button";
import { ShareButtons } from "@/components/share-buttons";
import { ReviewList } from "@/components/review-list";
import { ReviewForm } from "@/components/review-form";
import { ReportDialog } from "@/components/report-dialog";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getIdeaById } from "@/actions/ideas";

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
      creator: { select: { id: true, name: true, avatarUrl: true } },
      _count: { select: { purchases: true } },
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
  if (currentUser && !isOwner) {
    const purchase = await prisma.purchase.findUnique({
      where: { buyerId_ideaId: { buyerId: currentUser.id, ideaId: id } },
    });
    isPurchased = purchase?.status === "COMPLETED";
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

  const showContent = isOwner || isPurchased;

  return (
    <div className="container mx-auto px-4 py-12">
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
              {clerkId && !isOwner && (
                <ReportDialog ideaId={id} />
              )}
            </div>

            {idea.teaserText && (
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {idea.teaserText}
              </p>
            )}

            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {idea._count.purchases} purchase
                {idea._count.purchases !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(idea.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
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
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Price & unlock card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 text-center">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(idea.priceInCents)}
                </span>
                {idea.unlockType === "EXCLUSIVE" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    One-time exclusive unlock
                  </p>
                )}
              </div>

              <UnlockButton
                ideaId={id}
                priceInCents={idea.priceInCents}
                isExclusive={idea.unlockType === "EXCLUSIVE"}
                isPurchased={isPurchased}
                isAuthenticated={!!clerkId}
                isOwner={isOwner}
                exclusiveClaimed={exclusiveClaimed}
              />
            </div>

            {/* Creator card */}
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

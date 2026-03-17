import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const discoveryIdeaSelect = {
  id: true,
  title: true,
  teaserText: true,
  teaserImageUrl: true,
  priceInCents: true,
  unlockType: true,
  maxUnlocks: true,
  category: true,
  subcategoryId: true,
  maturityLevel: true,
  tags: true,
  originalityConfirmed: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      stripeOnboarded: true,
    },
  },
  _count: {
    select: {
      purchases: true,
      reviews: true,
    },
  },
} satisfies Prisma.IdeaSelect;

export type DiscoveryIdea = Prisma.IdeaGetPayload<{
  select: typeof discoveryIdeaSelect;
}>;

export function scoreRelatedIdea(
  reference: Pick<DiscoveryIdea, "category" | "subcategoryId" | "tags" | "createdAt">,
  candidate: Pick<DiscoveryIdea, "category" | "subcategoryId" | "tags" | "_count" | "createdAt">
) {
  const sharedTags = candidate.tags.filter((tag) => reference.tags.includes(tag)).length;
  const ageInDays = Math.max(
    0,
    Math.floor((Date.now() - candidate.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    (candidate.subcategoryId && candidate.subcategoryId === reference.subcategoryId ? 8 : 0) +
    (candidate.category && candidate.category === reference.category ? 4 : 0) +
    sharedTags * 2 +
    Math.min(candidate._count.purchases, 4) +
    Math.min(candidate._count.reviews, 2) +
    Math.max(0, 6 - ageInDays / 7)
  );
}

export function scoreRisingIdea(
  idea: Pick<DiscoveryIdea, "createdAt" | "_count" | "originalityConfirmed">
) {
  const ageInDays = Math.max(
    0,
    Math.floor((Date.now() - idea.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    idea._count.purchases * 4 +
    idea._count.reviews * 2 +
    Math.max(0, 14 - ageInDays) +
    (idea.originalityConfirmed ? 1 : 0)
  );
}

export async function getRelatedIdeas({
  ideaId,
  category,
  subcategoryId,
  tags,
  take = 4,
}: {
  ideaId: string;
  category?: string | null;
  subcategoryId?: string | null;
  tags?: string[];
  take?: number;
}) {
  const relatedFilters: Prisma.IdeaWhereInput[] = [
    ...(subcategoryId ? [{ subcategoryId }] : []),
    ...(category ? [{ category }] : []),
    ...(tags && tags.length > 0 ? [{ tags: { hasSome: tags.slice(0, 5) } }] : []),
  ];

  const candidates = await prisma.idea.findMany({
    where: {
      published: true,
      id: { not: ideaId },
      ...(relatedFilters.length > 0 ? { OR: relatedFilters } : {}),
    },
    select: discoveryIdeaSelect,
    take: 18,
    orderBy: [{ createdAt: "desc" }],
  });

  const reference = {
    category: category ?? null,
    subcategoryId: subcategoryId ?? null,
    tags: tags ?? [],
    createdAt: new Date(),
  };

  return candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreRelatedIdea(reference, candidate),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b._count.purchases - a._count.purchases ||
        b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, take);
}

export async function getRisingIdeas({
  excludeIds = [],
  take = 4,
  category,
}: {
  excludeIds?: string[];
  take?: number;
  category?: string | null;
}) {
  const ideas = await prisma.idea.findMany({
    where: {
      published: true,
      id: excludeIds.length > 0 ? { notIn: excludeIds } : undefined,
      category: category ?? undefined,
    },
    select: discoveryIdeaSelect,
    take: 24,
    orderBy: [{ createdAt: "desc" }],
  });

  return ideas
    .map((idea) => ({
      ...idea,
      score: scoreRisingIdea(idea),
    }))
    .filter((idea) => idea.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b._count.purchases - a._count.purchases ||
        b.createdAt.getTime() - a.createdAt.getTime()
    )
    .slice(0, take);
}

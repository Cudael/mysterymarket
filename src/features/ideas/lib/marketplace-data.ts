import type { IdeaMaturity, Prisma } from "@prisma/client";
import { CATEGORY_META, IDEA_MATURITY_LEVELS, ITEMS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";
import {
  DEFAULT_MARKETPLACE_SORT,
  getCategoryNameFromSlug,
  type MarketplaceQueryState,
  type MarketplaceSortValue,
  type MarketplaceUnlockValue,
} from "./marketplace-filters";

export const marketplaceIdeaInclude = {
  creator: { select: { id: true, name: true, avatarUrl: true } },
  subcategory: { select: { id: true, name: true, slug: true } },
  _count: { select: { purchases: true, reviews: true } },
} satisfies Prisma.IdeaInclude;

export type MarketplaceIdea = Prisma.IdeaGetPayload<{
  include: typeof marketplaceIdeaInclude;
}>;

export interface MarketplaceSearchParams {
  search?: string;
  category?: string;
  unlockType?: string;
  sortBy?: string;
  page?: string;
  subcategory?: string;
  maturity?: string;
}

export interface ResolvedSubcategory {
  id: string;
  name: string;
  slug: string;
  category: {
    name: string;
    slug: string;
  };
}

export interface CategoryIdeaCount {
  name: string;
  slug: string;
  description: string;
  icon: string;
  count: number;
}

export interface SubcategoryIdeaCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export function normalizeMarketplaceSearchParams(
  params: MarketplaceSearchParams
): MarketplaceQueryState {
  const sortValues = new Set<MarketplaceSortValue>([
    "newest",
    "best-rated",
    "most-purchased",
    "price-low",
    "price-high",
  ]);
  const unlockValues = new Set<MarketplaceUnlockValue>(["", "EXCLUSIVE", "MULTI"]);
  const maturityValues = new Set(IDEA_MATURITY_LEVELS.map((level) => level.value));

  const rawCategory = params.category?.trim() ?? "";
  const normalizedCategory =
    CATEGORY_META[rawCategory]?.name ?? getCategoryNameFromSlug(rawCategory) ?? "";
  const sortBy = sortValues.has(params.sortBy as MarketplaceSortValue)
    ? (params.sortBy as MarketplaceSortValue)
    : DEFAULT_MARKETPLACE_SORT;
  const unlockType = unlockValues.has(params.unlockType as MarketplaceUnlockValue)
    ? (params.unlockType as MarketplaceUnlockValue)
    : "";
  const maturityCandidate = params.maturity ?? "";
  const maturity = maturityValues.has(maturityCandidate as IdeaMaturity)
    ? maturityCandidate
    : "";

  return {
    search: params.search?.trim() ?? "",
    category: normalizedCategory,
    unlockType,
    sortBy,
    maturity,
    subcategory: params.subcategory?.trim() ?? "",
    page: Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  };
}

export async function resolveSubcategory(
  slug?: string
): Promise<ResolvedSubcategory | null> {
  if (!slug) return null;

  const subcategory = await prisma.subcategory.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return subcategory;
}

export function buildMarketplaceWhere({
  filters,
  categoryName,
  resolvedSubcategory,
}: {
  filters: MarketplaceQueryState;
  categoryName?: string | null;
  resolvedSubcategory?: ResolvedSubcategory | null;
}): Prisma.IdeaWhereInput {
  const activeCategory = (categoryName ?? filters.category) || undefined;
  const search = filters.search;

  return {
    published: true,
    ...(activeCategory ? { category: activeCategory } : {}),
    ...(filters.unlockType ? { unlockType: filters.unlockType } : {}),
    ...(filters.maturity
      ? { maturityLevel: filters.maturity as IdeaMaturity }
      : {}),
    ...(resolvedSubcategory ? { subcategoryId: resolvedSubcategory.id } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { teaserText: { contains: search, mode: "insensitive" as const } },
            {
              creator: {
                is: {
                  name: { contains: search, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {}),
  };
}

export async function getBookmarkedIdeaIds(
  clerkId?: string | null
): Promise<Set<string>> {
  if (!clerkId) return new Set<string>();

  const bookmarks = await prisma.bookmark.findMany({
    where: { user: { clerkId } },
    select: { ideaId: true },
  });

  return new Set(bookmarks.map((bookmark) => bookmark.ideaId));
}

export async function getIdeaRatings(ideaIds: string[]): Promise<Map<string, number>> {
  if (ideaIds.length === 0) return new Map<string, number>();

  const ratings = await prisma.review.groupBy({
    by: ["ideaId"],
    where: { ideaId: { in: ideaIds } },
    _avg: { rating: true },
  });

  return new Map(
    ratings.map((rating) => [rating.ideaId, Number(rating._avg.rating ?? 0)])
  );
}

function getMarketplaceOrderBy(
  sortBy: MarketplaceSortValue
): Prisma.IdeaOrderByWithRelationInput {
  if (sortBy === "price-low") {
    return { priceInCents: "asc" };
  }

  if (sortBy === "price-high") {
    return { priceInCents: "desc" };
  }

  if (sortBy === "most-purchased") {
    return { purchases: { _count: "desc" } };
  }

  return { createdAt: "desc" };
}

export async function getMarketplaceIdeas({
  filters,
  where,
}: {
  filters: MarketplaceQueryState;
  where: Prisma.IdeaWhereInput;
}): Promise<{ ideas: MarketplaceIdea[]; total: number; totalPages: number }> {
  const isBestRated = filters.sortBy === "best-rated";

  if (isBestRated) {
    const ratingGroups = await prisma.review.groupBy({
      by: ["ideaId"],
      where: { idea: where },
      _avg: { rating: true },
      orderBy: { _avg: { rating: "desc" } },
    });

    const ratedIdeaIds = ratingGroups.map((group) => group.ideaId);
    const ratingMap = new Map(
      ratingGroups.map((group) => [group.ideaId, group._avg.rating ?? 0])
    );

    const [allIdeas, total] = await Promise.all([
      prisma.idea.findMany({
        where,
        include: marketplaceIdeaInclude,
        orderBy: { createdAt: "desc" },
      }),
      prisma.idea.count({ where }),
    ]);

    const ratedIdeas = ratedIdeaIds
      .map((ideaId) => allIdeas.find((idea) => idea.id === ideaId))
      .filter((idea): idea is MarketplaceIdea => idea !== undefined);
    const unratedIdeas = allIdeas.filter((idea) => !ratingMap.has(idea.id));
    const orderedIdeas = [...ratedIdeas, ...unratedIdeas];

    return {
      ideas: orderedIdeas.slice(
        (filters.page - 1) * ITEMS_PER_PAGE,
        filters.page * ITEMS_PER_PAGE
      ),
      total,
      totalPages: Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    };
  }

  const orderBy = getMarketplaceOrderBy(filters.sortBy);

  const [ideas, total] = await Promise.all([
    prisma.idea.findMany({
      where,
      include: marketplaceIdeaInclude,
      orderBy,
      skip: (filters.page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.idea.count({ where }),
  ]);

  return {
    ideas,
    total,
    totalPages: Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
  };
}

export async function getTopCategoryCounts(limit = 6): Promise<CategoryIdeaCount[]> {
  const grouped = await prisma.idea.groupBy({
    by: ["category"],
    where: {
      published: true,
      category: { not: null },
    },
    _count: {
      category: true,
    },
  });

  return grouped
    .filter(
      (
        group
      ): group is typeof group & {
        category: string;
      } => Boolean(group.category && CATEGORY_META[group.category])
    )
    .map((group) => {
      const meta = CATEGORY_META[group.category];

      return {
        name: meta.name,
        slug: meta.slug,
        description: meta.description,
        icon: meta.icon,
        count: group._count.category,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export async function getSubcategoryIdeaCounts(
  categoryName: string
): Promise<SubcategoryIdeaCount[]> {
  const grouped = await prisma.idea.groupBy({
    by: ["subcategoryId"],
    where: {
      published: true,
      category: categoryName,
      subcategoryId: { not: null },
    },
    _count: {
      subcategoryId: true,
    },
  });

  const ids = grouped
    .map((group) => group.subcategoryId)
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) return [];

  const subcategories = await prisma.subcategory.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const countMap = new Map(
    grouped
      .filter(
        (group): group is typeof group & {
          subcategoryId: string;
        } => Boolean(group.subcategoryId)
      )
      .map((group) => [group.subcategoryId, group._count.subcategoryId])
  );

  return subcategories
    .map((subcategory) => ({
      ...subcategory,
      count: countMap.get(subcategory.id) ?? 0,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

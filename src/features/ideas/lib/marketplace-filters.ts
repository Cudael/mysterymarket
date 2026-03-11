import { CATEGORY_META, IDEA_MATURITY_LEVELS } from "@/lib/constants";

export const MARKETPLACE_UNLOCK_TYPES = [
  { label: "All unlock models", value: "" },
  { label: "Exclusive drops", value: "EXCLUSIVE" },
  { label: "Multi-unlock ideas", value: "MULTI" },
] as const;

export const MARKETPLACE_SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Best rated", value: "best-rated" },
  { label: "Most unlocked", value: "most-purchased" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" },
] as const;

export const DEFAULT_MARKETPLACE_SORT = "newest";

export type MarketplaceSortValue =
  (typeof MARKETPLACE_SORT_OPTIONS)[number]["value"];

export type MarketplaceUnlockValue =
  (typeof MARKETPLACE_UNLOCK_TYPES)[number]["value"];

export interface MarketplaceQueryState {
  search: string;
  unlockType: MarketplaceUnlockValue;
  sortBy: MarketplaceSortValue;
  maturity: string;
  subcategory: string;
  page: number;
  category: string;
}

export function getCategoryNameFromSlug(slug?: string | null): string | null {
  if (!slug) return null;

  return (
    Object.values(CATEGORY_META).find((category) => category.slug === slug)?.name ??
    null
  );
}

export function getCategorySlugFromName(name?: string | null): string | null {
  if (!name) return null;
  return CATEGORY_META[name]?.slug ?? null;
}

export function getSortLabel(value: string): string {
  return (
    MARKETPLACE_SORT_OPTIONS.find((option) => option.value === value)?.label ??
    "Newest"
  );
}

export function getUnlockTypeLabel(value: string): string {
  if (!value) return "All unlock models";

  return (
    MARKETPLACE_UNLOCK_TYPES.find((option) => option.value === value)?.label ??
    value
  );
}

export function getMaturityLabel(value: string): string {
  if (!value) return "All maturity levels";

  return (
    IDEA_MATURITY_LEVELS.find((option) => option.value === value)?.label ?? value
  );
}

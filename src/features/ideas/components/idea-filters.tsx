"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { CATEGORIES, IDEA_MATURITY_LEVELS, getSubcategoriesByCategory } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MARKETPLACE_SORT_OPTIONS,
  MARKETPLACE_UNLOCK_TYPES,
  getCategoryNameFromSlug,
  getCategorySlugFromName,
  getMaturityLabel,
  getSortLabel,
  getUnlockTypeLabel,
} from "@/features/ideas/lib/marketplace-filters";

interface IdeaFiltersProps {
  total: number;
  activeCategorySlug?: string | null;
  activeCategoryName?: string | null;
  featuredSubcategories?: Array<{
    name: string;
    slug: string;
    count?: number;
  }>;
}

const SELECT_CLASS_NAME =
  "h-11 w-full appearance-none rounded-full border border-border bg-background/90 px-4 pr-10 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export function IdeaFilters({
  total,
  activeCategorySlug,
  activeCategoryName,
  featuredSubcategories = [],
}: IdeaFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearchUrl = searchParams.get("search") ?? "";
  const [localSearch, setLocalSearch] = useState(currentSearchUrl);

  const routeCategorySlug = activeCategorySlug ?? "";
  const routeCategoryName =
    activeCategoryName ?? getCategoryNameFromSlug(routeCategorySlug) ?? "";
  const currentSubcategory = searchParams.get("subcategory") ?? "";
  const currentUnlockType = searchParams.get("unlockType") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "newest";
  const currentMaturity = searchParams.get("maturity") ?? "";

  const availableSubcategories =
    featuredSubcategories.length > 0
      ? featuredSubcategories
      : routeCategoryName
        ? getSubcategoriesByCategory(routeCategoryName)
        : [];

  function pushWithParams(params: URLSearchParams, nextPathname = pathname) {
    const query = params.toString();
    router.push(query ? `${nextPathname}?${query}` : nextPathname);
  }

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && !(key === "sortBy" && value === "newest")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    pushWithParams(params);
  }

  function handleCategoryChange(categorySlug: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("subcategory");
    params.delete("page");

    if (!categorySlug) {
      pushWithParams(params, "/ideas");
      return;
    }

    pushWithParams(params, `/ideas/category/${categorySlug}`);
  }

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 400);
  }

  function clearAll() {
    setLocalSearch("");
    const resetPath =
      pathname.startsWith("/ideas/category/") && routeCategorySlug
        ? `/ideas/category/${routeCategorySlug}`
        : "/ideas";
    router.push(resetPath);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    setLocalSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  const activeFilters: { label: string; key: string }[] = [];
  if (currentSearchUrl) activeFilters.push({ label: `"${currentSearchUrl}"`, key: "search" });
  if (currentSubcategory) {
    const subcategoryLabel =
      availableSubcategories.find((subcategory) => subcategory.slug === currentSubcategory)
        ?.name ?? currentSubcategory;
    activeFilters.push({ label: subcategoryLabel, key: "subcategory" });
  }
  if (currentMaturity) {
    activeFilters.push({ label: getMaturityLabel(currentMaturity), key: "maturity" });
  }
  if (currentUnlockType) {
    activeFilters.push({ label: getUnlockTypeLabel(currentUnlockType), key: "unlockType" });
  }
  if (currentSortBy && currentSortBy !== "newest") {
    activeFilters.push({ label: getSortLabel(currentSortBy), key: "sortBy" });
  }

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-border/70 bg-card/95 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.12),_transparent_38%)]" />

      <div className="relative">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Discovery controls
            </div>
            <h2 className="mt-4 text-[24px] font-semibold tracking-[-0.03em] text-foreground sm:text-[28px]">
              Refine the mystery without giving it away
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-[15px]">
              {total} {total === 1 ? "idea" : "ideas"} match your current view
              {routeCategoryName ? ` in ${routeCategoryName}` : ""}.
            </p>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={clearAll}
              className="rounded-full border-border bg-background/80"
            >
              Clear filters
            </Button>
          )}
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={localSearch}
              placeholder="Search by title, teaser, or creator..."
              className="h-12 rounded-full border-border bg-background/90 pl-11 pr-4 shadow-sm"
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <select
                value={routeCategorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={SELECT_CLASS_NAME}
              >
                <option value="">All collections</option>
                {CATEGORIES.map((categoryName) => {
                  return (
                    <option
                      key={categoryName}
                      value={getCategorySlugFromName(categoryName) ?? ""}
                    >
                      {categoryName}
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            <div className="relative">
              <select
                value={currentUnlockType}
                onChange={(e) => updateParam("unlockType", e.target.value)}
                className={cn(SELECT_CLASS_NAME, "pl-10")}
              >
                {MARKETPLACE_UNLOCK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {MARKETPLACE_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateParam("sortBy", option.value)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                currentSortBy === option.value
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-primary-glow)]"
                  : "border-border bg-background/80 text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="relative">
            <select
              value={currentMaturity}
              onChange={(e) => updateParam("maturity", e.target.value)}
              className={SELECT_CLASS_NAME}
            >
              <option value="">All maturity levels</option>
              {IDEA_MATURITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative md:col-span-2">
            <select
              value={currentSubcategory}
              onChange={(e) => updateParam("subcategory", e.target.value)}
              className={cn(
                SELECT_CLASS_NAME,
                availableSubcategories.length === 0 &&
                  "cursor-not-allowed opacity-60"
              )}
              disabled={availableSubcategories.length === 0}
            >
              <option value="">
                {availableSubcategories.length === 0
                  ? "Choose a collection to browse subcategories"
                  : "All subcategories"}
              </option>
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory.slug} value={subcategory.slug}>
                  {subcategory.name}
                  {"count" in subcategory && subcategory.count
                    ? ` (${subcategory.count})`
                    : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {availableSubcategories.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Quick lanes
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => updateParam("subcategory", "")}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-2 text-sm transition",
                  currentSubcategory === ""
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-border bg-background/80 text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
              {availableSubcategories.slice(0, 10).map((subcategory) => (
                <button
                  key={subcategory.slug}
                  type="button"
                  onClick={() => updateParam("subcategory", subcategory.slug)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-2 text-sm transition",
                    currentSubcategory === subcategory.slug
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-border bg-background/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {subcategory.name}
                  {"count" in subcategory && subcategory.count ? ` · ${subcategory.count}` : ""}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-muted-foreground">
              Active filters
            </span>
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => {
                  if (filter.key === "search") {
                    setLocalSearch("");
                  }
                  updateParam(filter.key, "");
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[12px] font-medium text-primary transition hover:bg-primary/15"
              >
                {filter.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

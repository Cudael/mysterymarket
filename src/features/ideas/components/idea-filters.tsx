"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { CATEGORIES, IDEA_MATURITY_LEVELS, getSubcategoriesByCategory } from "@/lib/constants";

const UNLOCK_TYPES = [
  { label: "All Types", value: "" },
  { label: "Exclusive Only", value: "EXCLUSIVE" },
  { label: "Multi-unlock", value: "MULTI" },
];

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Best Rated", value: "best-rated" },
  { label: "Most Popular", value: "most-purchased" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
];

export function IdeaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearchUrl = searchParams.get("search") ?? "";
  const [localSearch, setLocalSearch] = useState(currentSearchUrl);

  const currentCategory = searchParams.get("category") ?? "";
  const currentSubcategory = searchParams.get("subcategory") ?? "";
  const currentUnlockType = searchParams.get("unlockType") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "newest";
  const currentMaturity = searchParams.get("maturity") ?? "";

  const availableSubcategories = getSubcategoriesByCategory(currentCategory);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && !(key === "sortBy" && value === "newest")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/ideas?${params.toString()}`);
  }

  function handleCategoryChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    params.delete("subcategory");
    params.delete("page");
    router.push(`/ideas?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 400);
  }

  function clearAll() {
    setLocalSearch("");
    router.push("/ideas");
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
  if (currentCategory) activeFilters.push({ label: currentCategory, key: "category" });
  if (currentSubcategory) activeFilters.push({ label: currentSubcategory, key: "subcategory" });
  if (currentMaturity) {
    const maturityLabel = IDEA_MATURITY_LEVELS.find((m) => m.value === currentMaturity)?.label ?? currentMaturity;
    activeFilters.push({ label: maturityLabel, key: "maturity" });
  }
  if (currentUnlockType) {
    activeFilters.push({
      label: currentUnlockType === "EXCLUSIVE" ? "Exclusive Only" : "Multi-unlock",
      key: "unlockType",
    });
  }
  if (currentSortBy && currentSortBy !== "newest") {
    const sortLabel = SORT_OPTIONS.find((s) => s.value === currentSortBy)?.label ?? currentSortBy;
    activeFilters.push({ label: sortLabel, key: "sortBy" });
  }

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search for hidden insights..."
            value={localSearch}
            className="h-10 w-full rounded-[8px] border border-border bg-muted pl-10 pr-4 text-[14px] text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <select
              value={currentUnlockType}
              onChange={(e) => updateParam("unlockType", e.target.value)}
              className="h-10 w-full sm:w-[180px] appearance-none rounded-[8px] border border-border bg-muted pl-9 pr-8 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              {UNLOCK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="h-10 w-full sm:w-[200px] appearance-none rounded-[8px] border border-border bg-muted px-4 pr-10 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {availableSubcategories.length > 0 && (
            <div className="relative flex-1 sm:flex-none">
              <select
                value={currentSubcategory}
                onChange={(e) => updateParam("subcategory", e.target.value)}
                className="h-10 w-full sm:w-[220px] appearance-none rounded-[8px] border border-border bg-muted px-4 pr-10 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
              >
                <option value="">All Subcategories</option>
                {availableSubcategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          )}

          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentMaturity}
              onChange={(e) => updateParam("maturity", e.target.value)}
              className="h-10 w-full sm:w-[180px] appearance-none rounded-[8px] border border-border bg-muted px-4 pr-10 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <option value="">All Maturities</option>
              {IDEA_MATURITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentSortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
              className="h-10 w-full sm:w-[200px] appearance-none rounded-[8px] border border-border bg-muted px-4 pr-10 text-[14px] text-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              {SORT_OPTIONS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-medium text-muted-foreground">Active:</span>
          {activeFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                if (f.key === "search") {
                  setLocalSearch("");
                }
                updateParam(f.key, "");
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[12px] font-medium text-primary transition-colors hover:bg-primary/20"
            >
              {f.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-[12px] font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

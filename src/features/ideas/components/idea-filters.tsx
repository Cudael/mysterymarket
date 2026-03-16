"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKETPLACE_SORT_OPTIONS } from "@/features/ideas/lib/marketplace-filters";

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function IdeaFilters(_props: IdeaFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearchUrl = searchParams.get("search") ?? "";
  const [localSearch, setLocalSearch] = useState(currentSearchUrl);
  const [isFocused, setIsFocused] = useState(false);
  const currentSortBy = searchParams.get("sortBy") ?? "newest";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && !(key === "sortBy" && value === "newest")) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function handleSearchChange(value: string) {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 400);
  }

  function clearSearch() {
    setLocalSearch("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    updateParam("search", "");
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    setLocalSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200",
            isFocused ? "text-primary/70" : "text-white/25"
          )}
        />
        <input
          type="search"
          value={localSearch}
          placeholder="Search ideas, topics, creators…"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={cn(
            "h-11 w-full rounded-full border bg-[hsl(252,28%,7%)] pl-11 pr-10 text-[14px] text-white/90 placeholder:text-white/25 outline-none transition-all duration-200",
            "[&::-webkit-search-cancel-button]:hidden",
            isFocused
              ? "border-primary/40 shadow-[0_0_0_3px_hsl(252_85%_62%_/_0.10)]"
              : "border-white/[0.07] hover:border-white/[0.12]"
          )}
        />
        {localSearch && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/50 transition hover:bg-white/20 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Sort pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        {MARKETPLACE_SORT_OPTIONS.map((opt) => {
          const isActive = currentSortBy === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateParam("sortBy", opt.value)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/15 border border-primary/35 text-primary shadow-[0_0_12px_hsl(252_85%_62%_/_0.15)]"
                  : "border border-white/[0.07] bg-white/[0.03] text-white/45 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white/75"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

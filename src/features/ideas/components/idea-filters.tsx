"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={localSearch}
          placeholder="Search ideas..."
          className="h-11 rounded-full border-border bg-background pl-11 pr-4"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>
      {/* Sort */}
      <div className="relative shrink-0">
        <select
          value={currentSortBy}
          onChange={(e) => updateParam("sortBy", e.target.value)}
          className="h-11 appearance-none rounded-full border border-border bg-background px-5 pr-10 text-[14px] font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          {MARKETPLACE_SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    </div>
  );
}

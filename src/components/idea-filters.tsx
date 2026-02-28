"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/constants";

const UNLOCK_TYPES = [
  { label: "All Types", value: "" },
  { label: "Exclusive", value: "EXCLUSIVE" },
  { label: "Multi-unlock", value: "MULTI" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Most Popular", value: "most-purchased" },
];

export function IdeaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentUnlockType = searchParams.get("unlockType") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/ideas?${params.toString()}`);
  }

  function handleSearchChange(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("search", value), 400);
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search ideas..."
          defaultValue={currentSearch}
          className="pl-10"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam("category", "")}
          className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
            !currentCategory
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              updateParam("category", currentCategory === cat ? "" : cat)
            }
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              currentCategory === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Unlock type + Sort row */}
      <div className="flex flex-wrap gap-3">
        <select
          value={currentUnlockType}
          onChange={(e) => updateParam("unlockType", e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        >
          {UNLOCK_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={currentSortBy}
          onChange={(e) => updateParam("sortBy", e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

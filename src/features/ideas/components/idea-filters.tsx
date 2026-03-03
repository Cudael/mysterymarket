"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const UNLOCK_TYPES = [
  { label: "All Types", value: "" },
  { label: "Exclusive Only", value: "EXCLUSIVE" },
  { label: "Multi-unlock", value: "MULTI" },
];

const SORT_OPTIONS = [
  { label: "Newest Arrivals", value: "" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Most Popular", value: "most-purchased" },
];

export function IdeaFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSearchUrl = searchParams.get("search") ?? "";
  const [localSearch, setLocalSearch] = useState(currentSearchUrl);

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
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40" />
          <input
            type="search"
            placeholder="Search for hidden insights..."
            value={localSearch}
            className="h-10 w-full rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] pl-10 pr-4 text-[14px] text-[#1A1A1A] placeholder:text-[#1A1A1A]/50 outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentUnlockType}
              onChange={(e) => updateParam("unlockType", e.target.value)}
              className="h-10 w-full sm:w-[180px] appearance-none rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 pr-10 text-[14px] text-[#1A1A1A] outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              {UNLOCK_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentCategory}
              onChange={(e) => updateParam("category", e.target.value)}
              className="h-10 w-full sm:w-[180px] appearance-none rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 pr-10 text-[14px] text-[#1A1A1A] outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={currentSortBy}
              onChange={(e) => updateParam("sortBy", e.target.value)}
              className="h-10 w-full sm:w-[200px] appearance-none rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 pr-10 text-[14px] text-[#1A1A1A] outline-none transition-all focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              {SORT_OPTIONS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
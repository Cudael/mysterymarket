"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useIdeaFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const unlockType = searchParams.get("unlockType") || "";
  const sortBy = searchParams.get("sortBy") || "newest";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/ideas?${params.toString()}`);
    },
    [searchParams, router]
  );

  return { category, search, unlockType, sortBy, setFilter };
}

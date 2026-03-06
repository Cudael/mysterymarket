"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/category-nav";
import { cn } from "@/lib/utils";

export function CategorySubnav() {
  const pathname = usePathname();

  // Determine active category slug from pathname
  const categorySlugMatch = pathname.match(/^\/ideas\/category\/([^/]+)/);
  const activeCategorySlug = categorySlugMatch ? categorySlugMatch[1] : null;
  const isAllIdeas = pathname === "/ideas" && !activeCategorySlug;

  return (
    <nav
      aria-label="Category navigation"
      /* top-[72px] matches the h-[72px] navbar height in navbar.tsx */
      className="sticky top-[72px] z-40 w-full border-b border-[#D9DCE3] bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-[1400px]">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide">
          {/* All ideas */}
          <Link
            href="/ideas"
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
              isAllIdeas
                ? "bg-[#3A5FCD] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                : "text-[#1A1A1A]/60 hover:bg-[#F5F6FA] hover:text-[#1A1A1A]"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
            All ideas
          </Link>

          {/* Divider */}
          <div className="mx-1 h-4 w-px shrink-0 bg-[#D9DCE3]" />

          {/* Category links */}
          {NAV_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.slug === activeCategorySlug;
            return (
              <Link
                key={cat.slug}
                href={`/ideas/category/${cat.slug}`}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
                  isActive
                    ? "bg-[#3A5FCD] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                    : "text-[#1A1A1A]/60 hover:bg-[#F5F6FA] hover:text-[#1A1A1A]"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-white" : "text-[#3A5FCD]")} />
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

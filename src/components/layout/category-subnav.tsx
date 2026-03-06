"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, ChevronDown } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/category-nav";
import { cn } from "@/lib/utils";

function SubcategoryDropdown({
  activeCategorySlug,
}: {
  activeCategorySlug: string;
}) {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeSubcategorySlug = searchParams.get("subcategory");
  const activeCategory = NAV_CATEGORIES.find((c) => c.slug === activeCategorySlug) ?? null;
  const activeSubcategory =
    activeCategory?.quickLinks.find((s) => s.slug === activeSubcategorySlug) ?? null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!activeCategory) return null;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 whitespace-nowrap",
          activeSubcategorySlug
            ? "bg-[#3A5FCD]/10 text-[#3A5FCD] border border-[#3A5FCD]/30"
            : "text-[#1A1A1A]/60 hover:bg-[#F5F6FA] hover:text-[#1A1A1A]"
        )}
      >
        {activeSubcategory ? activeSubcategory.name : `All ${activeCategory.name}`}
        <ChevronDown
          className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Subcategory filter"
          className="absolute left-0 top-full mt-1.5 z-50 w-[280px] rounded-[12px] border border-[#D9DCE3] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden py-1.5"
        >
          <Link
            href={`/ideas/category/${activeCategorySlug}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block px-3.5 py-2 text-[13px] font-medium transition-colors",
              !activeSubcategorySlug
                ? "text-[#3A5FCD] bg-[#3A5FCD]/[0.07]"
                : "text-[#1A1A1A]/70 hover:bg-[#F5F6FA] hover:text-[#1A1A1A]"
            )}
          >
            All {activeCategory.name}
          </Link>
          <div className="my-1 h-px bg-[#D9DCE3]" />
          {activeCategory.quickLinks.map((sub) => (
            <Link
              key={sub.slug}
              href={`/ideas/category/${activeCategorySlug}?subcategory=${sub.slug}`}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-3.5 py-2 text-[13px] font-medium leading-snug transition-colors",
                sub.slug === activeSubcategorySlug
                  ? "text-[#3A5FCD] bg-[#3A5FCD]/[0.07]"
                  : "text-[#1A1A1A]/70 hover:bg-[#F5F6FA] hover:text-[#1A1A1A]"
              )}
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function CategorySubnavContent() {
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
      <div className="w-full px-4 lg:px-8">
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

          {/* Subcategory dropdown — shown only on category pages */}
          {activeCategorySlug && (
            <>
              <div className="mx-1 h-4 w-px shrink-0 bg-[#D9DCE3]" />
              <Suspense
                fallback={
                  <div className="flex shrink-0 items-center gap-1.5 rounded-[8px] px-3.5 py-1.5 text-[13px] font-medium text-[#1A1A1A]/60 whitespace-nowrap">
                    All subcategories
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  </div>
                }
              >
                <SubcategoryDropdown activeCategorySlug={activeCategorySlug} />
              </Suspense>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export function CategorySubnav() {
  return (
    <Suspense
      fallback={
        <nav
          aria-label="Category navigation"
          className="sticky top-[72px] z-40 w-full border-b border-[#D9DCE3] bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
        >
          <div className="w-full px-4 lg:px-8">
            <div className="h-[52px]" />
          </div>
        </nav>
      }
    >
      <CategorySubnavContent />
    </Suspense>
  );
}

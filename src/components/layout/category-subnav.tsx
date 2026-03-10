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
  const activeCategory =
    NAV_CATEGORIES.find((c) => c.slug === activeCategorySlug) ?? null;
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
          "flex items-center gap-1.5 whitespace-nowrap rounded-[9px] border px-3.5 py-2 text-[13px] font-medium transition-all duration-150",
          activeSubcategorySlug
            ? "border-primary/25 bg-primary/10 text-primary"
            : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
        )}
      >
        {activeSubcategory ? activeSubcategory.name : `All ${activeCategory.name}`}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Subcategory filter"
          className="absolute left-0 top-full z-50 mt-2 w-[300px] overflow-hidden rounded-[14px] border border-border bg-card py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
        >
          <Link
            href={`/ideas/category/${activeCategorySlug}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block px-4 py-2.5 text-[13px] font-medium transition-colors",
              !activeSubcategorySlug
                ? "bg-primary/[0.07] text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All {activeCategory.name}
          </Link>

          <div className="my-1 h-px bg-border" />

          {activeCategory.quickLinks.map((sub) => (
            <Link
              key={sub.slug}
              href={`/ideas/category/${activeCategorySlug}?subcategory=${sub.slug}`}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-2.5 text-[13px] font-medium leading-snug transition-colors",
                sub.slug === activeSubcategorySlug
                  ? "bg-primary/[0.07] text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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

  const categorySlugMatch = pathname.match(/^\/ideas\/category\/([^/]+)/);
  const activeCategorySlug = categorySlugMatch ? categorySlugMatch[1] : null;
  const isAllIdeas = pathname === "/ideas" && !activeCategorySlug;

  return (
    <nav
      aria-label="Category navigation"
      className="sticky top-[72px] z-40 w-full border-b border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="w-full px-4 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          <Link
            href="/ideas"
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[9px] px-3.5 py-2 text-[13px] font-medium transition-all duration-150",
              isAllIdeas
                ? "bg-primary text-white shadow-[var(--shadow-primary-glow)]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
            All ideas
          </Link>

          <div className="mx-1 h-4 w-px shrink-0 bg-border" />

          {NAV_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.slug === activeCategorySlug;

            return (
              <Link
                key={cat.slug}
                href={`/ideas/category/${cat.slug}`}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[9px] px-3.5 py-2 text-[13px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-white shadow-[var(--shadow-primary-glow)]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    isActive ? "text-white" : "text-primary"
                  )}
                />
                {cat.name}
              </Link>
            );
          })}

          {activeCategorySlug && (
            <>
              <div className="mx-1 h-4 w-px shrink-0 bg-border" />
              <Suspense
                fallback={
                  <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[9px] px-3.5 py-2 text-[13px] font-medium text-muted-foreground">
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
          className="sticky top-[72px] z-40 w-full border-b border-border bg-card/95 backdrop-blur-sm"
        >
          <div className="w-full px-4 lg:px-8">
            <div className="h-[56px]" />
          </div>
        </nav>
      }
    >
      <CategorySubnavContent />
    </Suspense>
  );
}

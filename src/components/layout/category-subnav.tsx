"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Compass, LayoutGrid, Sparkles } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/categories";
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
          "flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition-all duration-150",
          activeSubcategorySlug
            ? "border-primary/20 bg-primary/10 text-primary"
            : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-foreground"
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
          className="absolute left-0 top-full z-50 mt-3 w-[320px] overflow-hidden rounded-[22px] border border-border bg-card p-2 shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
        >
          <div className="px-3 pb-3 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Subcategories
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Narrow this collection to a more specific vein of ideas.
            </p>
          </div>

          <Link
            href={`/ideas/category/${activeCategorySlug}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block rounded-[16px] px-4 py-3 text-[13px] font-medium transition-colors",
              !activeSubcategorySlug
                ? "bg-primary/[0.07] text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All {activeCategory.name}
          </Link>

          <div className="my-2 h-px bg-border" />

          {activeCategory.quickLinks.map((sub) => (
            <Link
              key={sub.slug}
              href={`/ideas/category/${activeCategorySlug}?subcategory=${sub.slug}`}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-[16px] px-4 py-3 text-[13px] font-medium leading-snug transition-colors",
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
      className="sticky top-[72px] z-40 w-full border-b border-border/70 bg-background/75 backdrop-blur-xl"
    >
      <div className="container mx-auto max-w-[1400px] px-4 py-3 lg:px-8">
        <div className="rounded-[24px] border border-border/70 bg-card/90 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Compass className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Marketplace collections
                </p>
                <p className="text-sm text-muted-foreground">
                  Browse hidden ideas by theme, then drill into a narrower lane.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary lg:flex">
              <Sparkles className="h-3.5 w-3.5" />
              Curated navigation
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Link
              href="/ideas"
              className={cn(
                "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition-all duration-150",
                isAllIdeas
                  ? "border-primary bg-primary text-white shadow-[var(--shadow-primary-glow)]"
                  : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5 shrink-0" />
              All ideas
            </Link>

            {NAV_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.slug === activeCategorySlug;

              return (
                <Link
                  key={cat.slug}
                  href={`/ideas/category/${cat.slug}`}
                  className={cn(
                    "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13px] font-medium transition-all duration-150",
                    isActive
                      ? "border-primary bg-primary text-white shadow-[var(--shadow-primary-glow)]"
                      : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-foreground"
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
              <Suspense
                fallback={
                  <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-4 py-2.5 text-[13px] font-medium text-muted-foreground">
                    All subcategories
                    <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                  </div>
                }
              >
                <SubcategoryDropdown activeCategorySlug={activeCategorySlug} />
              </Suspense>
            )}
          </div>
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
          className="sticky top-[72px] z-40 w-full border-b border-border/70 bg-background/75 backdrop-blur-xl"
        >
          <div className="container mx-auto max-w-[1400px] px-4 py-3 lg:px-8">
            <div className="h-[88px] rounded-[24px] border border-border/70 bg-card/90" />
          </div>
        </nav>
      }
    >
      <CategorySubnavContent />
    </Suspense>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, LayoutGrid } from "lucide-react";
import { NAV_CATEGORIES, type NavCategory } from "@/lib/category-nav";
import { cn } from "@/lib/utils";

export function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NavCategory>(
    NAV_CATEGORIES[0] ?? {
      name: "",
      slug: "",
      description: "",
      icon: () => null,
      quickLinks: [],
    }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ActiveIcon = activeCategory.icon;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 text-[15px] font-medium transition-all duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          open ? "text-primary" : "text-muted-foreground"
        )}
      >
        Categories
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Categories menu"
          className="absolute left-1/2 top-full z-50 mt-3 w-[920px] -translate-x-1/2 overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_12px_48px_rgba(0,0,0,0.12)]"
        >
          <div className="flex">
            <div className="flex w-[290px] shrink-0 flex-col gap-1 border-r border-border bg-muted p-3">
              {NAV_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = cat.slug === activeCategory.slug;

                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onMouseEnter={() => setActiveCategory(cat)}
                    onFocus={() => setActiveCategory(cat)}
                    className={cn(
                      "flex w-full items-start gap-2.5 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] font-medium transition-all duration-150",
                      isActive
                        ? "bg-primary text-white shadow-[var(--shadow-primary-glow)]"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "mt-[2px] h-4 w-4 shrink-0",
                        isActive ? "text-white" : "text-primary"
                      )}
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <Link
                href={`/ideas/category/${activeCategory.slug}`}
                onClick={() => setOpen(false)}
                className="group mb-5 flex items-start gap-3"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] border border-primary/20 bg-primary/10 transition-colors duration-200 group-hover:bg-primary">
                  <ActiveIcon className="h-5 w-5 text-primary transition-colors duration-200 group-hover:text-white" />
                </div>

                <div>
                  <p className="flex items-center gap-1.5 text-[16px] font-semibold text-foreground transition-colors duration-150 group-hover:text-primary">
                    {activeCategory.name}
                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100" />
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                    {activeCategory.description}
                  </p>
                </div>
              </Link>

              {activeCategory.quickLinks.length > 0 && (
                <div className="min-h-0 flex-1">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
                    Subcategories
                  </p>
                  <div className="max-h-[300px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-2">
                      {activeCategory.quickLinks.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/ideas/category/${activeCategory.slug}?subcategory=${sub.slug}`}
                          onClick={() => setOpen(false)}
                          className="rounded-[10px] border border-transparent px-3 py-2 text-[12.5px] font-medium leading-snug text-muted-foreground transition-all duration-150 hover:border-border hover:bg-muted hover:text-foreground"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 border-t border-border pt-4">
                <Link
                  href="/ideas"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Browse all ideas
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

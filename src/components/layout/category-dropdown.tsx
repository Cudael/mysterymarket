"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, LayoutGrid } from "lucide-react";
import { NAV_CATEGORIES, type NavCategory } from "@/lib/category-nav";
import { cn } from "@/lib/utils";

export function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<NavCategory>(
    NAV_CATEGORIES[0] ?? { name: "", slug: "", description: "", icon: () => null, quickLinks: [] }
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
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
          "flex items-center gap-1.5 text-[15px] font-medium transition-all duration-200 hover:text-[#3A5FCD] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A5FCD]/50 rounded-[4px] px-1",
          open ? "text-[#3A5FCD]" : "text-[#1A1A1A]/70"
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
          className="absolute left-1/2 top-full mt-3 -translate-x-1/2 z-50 w-[640px] rounded-[16px] border border-[#D9DCE3] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.10)] overflow-hidden"
        >
          <div className="flex">
            {/* Left: category list */}
            <div className="w-[220px] shrink-0 border-r border-[#D9DCE3] bg-[#F8F9FC] p-3 flex flex-col gap-0.5">
              {NAV_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = cat.slug === activeCategory.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onMouseEnter={() => setActiveCategory(cat)}
                    onFocus={() => setActiveCategory(cat)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left text-[13.5px] font-medium transition-all duration-150 w-full",
                      isActive
                        ? "bg-[#3A5FCD] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                        : "text-[#1A1A1A]/70 hover:bg-white hover:text-[#1A1A1A]"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-[#3A5FCD]")} />
                    <span className="line-clamp-1">{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: detail panel */}
            <div className="flex-1 p-6 flex flex-col">
              {/* Header */}
              <Link
                href={`/ideas/category/${activeCategory.slug}`}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 mb-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10 border border-[#3A5FCD]/20 group-hover:bg-[#3A5FCD] transition-colors duration-200">
                  <ActiveIcon className="h-5 w-5 text-[#3A5FCD] group-hover:text-white transition-colors duration-200" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors duration-150 flex items-center gap-1.5">
                    {activeCategory.name}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-[#1A1A1A]/55 leading-[1.5] line-clamp-2">
                    {activeCategory.description}
                  </p>
                </div>
              </Link>

              {/* Quick links */}
              {activeCategory.quickLinks.length > 0 && (
                <div className="flex-1">
                  <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                    Popular subcategories
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {activeCategory.quickLinks.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/ideas/category/${activeCategory.slug}?subcategory=${sub.slug}`}
                        onClick={() => setOpen(false)}
                        className="rounded-[8px] border border-transparent px-3 py-2 text-[12.5px] font-medium text-[#1A1A1A]/65 transition-all duration-150 hover:border-[#D9DCE3] hover:bg-[#F8F9FC] hover:text-[#3A5FCD] line-clamp-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer CTA */}
              <div className="mt-5 pt-4 border-t border-[#D9DCE3]">
                <Link
                  href="/ideas"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-[#3A5FCD] hover:text-[#6D7BE0] transition-colors"
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

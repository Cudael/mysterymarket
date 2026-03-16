"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-4">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-foreground/30 shrink-0" />
            )}
            {isLast || !item.href ? (
              <span className="text-[13px] font-medium text-foreground">
                {item.label === "Home" ? (
                  <span className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    <span className="sr-only">Home</span>
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-[13px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                {item.label === "Home" ? (
                  <>
                    <Home className="h-3.5 w-3.5" />
                    <span className="sr-only">Home</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

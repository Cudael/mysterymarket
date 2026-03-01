"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Lightbulb,
  PlusCircle,
  CreditCard,
  Settings,
  BarChart3,
  Wallet2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/creator", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/creator/wallet", label: "Wallet", icon: Wallet2, exact: false },
  { href: "/creator/ideas/new", label: "Create Idea", icon: PlusCircle, exact: true },
  { href: "/creator/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/creator/connect", label: "Stripe Connect", icon: CreditCard, exact: false },
  { href: "/settings", label: "Settings", icon: Settings, exact: false },
];

export function CreatorSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-border bg-gray-50/50 md:flex md:flex-col">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Creator Studio
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="flex overflow-x-auto border-b border-border bg-card px-4 md:hidden">
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors",
                isActive
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </div>
    </>
  );
}

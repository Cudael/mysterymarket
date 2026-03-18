"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Flag,
  DollarSign,
  Users,
  Lightbulb,
  Shield,
  ArrowLeft,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reports", label: "Reports", icon: Flag, exact: false },
  { href: "/admin/refunds", label: "Refunds", icon: DollarSign, exact: false },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: Banknote, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/ideas", label: "Ideas", icon: Lightbulb, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 border-r border-border bg-muted md:sticky md:top-[72px] md:flex md:h-[calc(100dvh-72px)] md:flex-col">
        <div className="border-b border-border px-4 py-4">
          <div className="rounded-[14px] border border-red-500/15 bg-card p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-red-500/20 bg-red-500/10">
                <Shield className="h-5 w-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold tracking-tight text-foreground">
                    Admin Panel
                  </span>
                  <span className="inline-flex items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    ADMIN
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-foreground/55">
                  Moderate users, ideas, reports, and refunds.
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col px-4 py-3">
          <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/35">
            Admin
          </p>

          <div className="flex flex-col gap-1">
            {ADMIN_NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-red-500/10 text-red-400"
                      : "text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-red-500" : "text-foreground/50"
                    )}
                  />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <div className="h-px bg-border" />
            <div className="pt-4">
              <Link
                href="/my"
                className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium text-muted-foreground transition-all hover:bg-card hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 text-foreground/40" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      <div className="flex overflow-x-auto border-b border-border bg-card px-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] md:hidden no-scrollbar">
        <div className="flex gap-2 py-3">
          {ADMIN_NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-[9px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-red-500/10 text-red-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}

          <Link
            href="/my"
            className="flex shrink-0 items-center gap-2 rounded-[9px] bg-muted px-4 py-2.5 text-[14px] font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Lightbulb,
  PlusCircle,
  CreditCard,
  Settings,
  BarChart3,
  Wallet2,
  ShoppingBag,
  Shield,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getIsAdmin } from "@/features/admin/actions";

const CREATOR_LINKS = [
  { href: "/studio", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/studio/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/studio/wallet", label: "Wallet", icon: Wallet2, exact: false },
  { href: "/studio/ideas/new", label: "New Idea", icon: PlusCircle, exact: true },
  { href: "/studio/payouts", label: "Payouts", icon: CreditCard, exact: false },
];

const ACCOUNT_LINKS = [
  { href: "/account", label: "Account", icon: Settings, exact: false },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getIsAdmin()
      .then(setIsAdmin)
      .catch(() => {});
  }, []);

  function NavLink({
    href,
    label,
    icon: Icon,
    exact,
    muted,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact: boolean;
    muted?: boolean;
  }) {
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
          isActive
            ? "bg-[#3A5FCD]/10 text-[#3A5FCD]"
            : muted
              ? "text-[#1A1A1A]/40 hover:bg-[#FFFFFF] hover:text-[#1A1A1A]/70 hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
              : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            isActive
              ? "text-[#3A5FCD]"
              : muted
                ? "text-[#1A1A1A]/30"
                : "text-[#1A1A1A]/50 group-hover:text-[#1A1A1A]/70"
          )}
        />
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <>
      <aside className="hidden w-[280px] shrink-0 border-r border-[#D9DCE3] bg-[#F5F6FA] md:sticky md:top-[72px] md:flex md:h-[calc(100dvh-72px)] md:flex-col">
        <div className="border-b border-[#D9DCE3] px-4 py-4">
          <div className="rounded-[14px] border border-[#D9DCE3] bg-[#FFFFFF] p-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex items-start gap-3 rounded-[10px] bg-[#F8F9FC] px-3 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
                <Lightbulb className="h-4 w-4 text-[#3A5FCD]" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A1A]">
                  Creator Studio
                </p>
                <p className="mt-0.5 text-[12px] leading-5 text-[#1A1A1A]/55">
                  Manage your ideas, payouts, and performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-3">
          <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A]/35">
            Creator
          </p>

          <div className="flex flex-col gap-1">
            {CREATOR_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          <div className="my-4 h-px bg-[#D9DCE3]" />

          <Link
            href="/my"
            className="flex items-center gap-2 rounded-[10px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF]/80 px-3.5 py-2.5 text-[13px] font-medium text-[#1A1A1A]/55 transition-all hover:border-[#3A5FCD]/30 hover:bg-[#FFFFFF] hover:text-[#3A5FCD]"
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            My Library
            <ArrowLeftRight className="ml-auto h-3.5 w-3.5 shrink-0" />
          </Link>

          <div className="my-4 h-px bg-[#D9DCE3]" />

          <p className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1A1A1A]/35">
            Account
          </p>

          <div className="flex flex-col gap-1">
            {ACCOUNT_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {isAdmin && (
            <>
              <div className="my-4 h-px bg-[#D9DCE3]" />
              <Link
                href="/admin"
                className={cn(
                  "mt-1 flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  pathname.startsWith("/admin")
                    ? "bg-red-500/10 text-red-600"
                    : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
                )}
              >
                <Shield
                  className={cn(
                    "h-4 w-4 shrink-0",
                    pathname.startsWith("/admin")
                      ? "text-red-500"
                      : "text-[#1A1A1A]/50"
                  )}
                />
                Admin Panel
                <span className="ml-auto flex h-4 min-w-[28px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  ADMIN
                </span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="flex flex-col border-b border-[#D9DCE3] bg-[#FFFFFF] md:hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-2 px-4 py-3">
            {CREATOR_LINKS.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[9px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                    isActive
                      ? "bg-[#3A5FCD]/10 text-[#3A5FCD]"
                      : "bg-[#F5F6FA] text-[#1A1A1A]/70 hover:bg-[#E8EBF2] hover:text-[#1A1A1A]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

            <div className="mx-1 my-auto h-5 w-px shrink-0 bg-[#D9DCE3]" />

            {ACCOUNT_LINKS.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[9px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                    isActive
                      ? "bg-[#3A5FCD]/10 text-[#3A5FCD]"
                      : "bg-[#F5F6FA] text-[#1A1A1A]/70 hover:bg-[#E8EBF2] hover:text-[#1A1A1A]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-[9px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-red-500/10 text-red-600"
                    : "bg-[#F5F6FA] text-[#1A1A1A]/70 hover:bg-[#E8EBF2] hover:text-[#1A1A1A]"
                )}
              >
                <Shield className="h-4 w-4" />
                Admin
                <span className="flex h-4 min-w-[28px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  ADMIN
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


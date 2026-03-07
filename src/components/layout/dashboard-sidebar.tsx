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
  Bookmark,
  Bell,
  Shield,
  PieChart,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUnreadCount } from "@/features/notifications/actions";
import { getIsAdmin } from "@/features/admin/actions";

const BUYER_LINKS = [
  { href: "/dashboard", label: "Overview", icon: ShoppingBag, exact: true },
  { href: "/dashboard/insights", label: "Insights", icon: PieChart, exact: false },
  { href: "/dashboard/bookmarks", label: "Saved Ideas", icon: Bookmark, exact: false },
  { href: "/dashboard/wallet", label: "Wallet", icon: Wallet2, exact: false },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: false },
];

const CREATOR_LINKS = [
  { href: "/creator", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/creator/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/creator/wallet", label: "Earnings", icon: Wallet2, exact: false },
  { href: "/creator/ideas/new", label: "New Idea", icon: PlusCircle, exact: true },
  { href: "/creator/connect", label: "Payouts", icon: CreditCard, exact: false },
];

const ACCOUNT_LINKS = [
  { href: "/settings", label: "Settings", icon: Settings, exact: false },
];

type Workspace = "buyer" | "creator";

function getWorkspaceFromPath(pathname: string): Workspace {
  if (pathname.startsWith("/creator")) return "creator";
  return "buyer";
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>("buyer");

  // Auto-switch workspace when navigating between buyer/creator routes
  useEffect(() => {
    setActiveWorkspace(getWorkspaceFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    getIsAdmin()
      .then(setIsAdmin)
      .catch(() => {});

    const fetchCount = () => {
      getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {});
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);

    return () => clearInterval(interval);
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
    const isNotifications = href === "/dashboard/notifications";
    return (
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
          isActive
            ? "bg-[#3A5FCD]/10 text-[#3A5FCD]"
            : muted
            ? "text-[#1A1A1A]/40 hover:bg-[#FFFFFF] hover:text-[#1A1A1A]/70 hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-[#3A5FCD]" : muted ? "text-[#1A1A1A]/30" : "text-[#1A1A1A]/50"
          )}
        />
        {label}
        {isNotifications && unreadCount > 0 && (
          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>
    );
  }

  const isBuyer = activeWorkspace === "buyer";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-[#D9DCE3] bg-[#F5F6FA]/50 md:flex md:flex-col">
        {/* Workspace switcher header */}
        <div className="border-b border-[#D9DCE3] px-4 py-3">
          <p className="mb-2 px-1.5 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/35">
            Workspace
          </p>
          <div className="flex gap-1.5 rounded-[10px] bg-[#EBEBF0] p-1">
            <button
              onClick={() => setActiveWorkspace("buyer")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-[7px] px-3 py-2 text-[13px] font-semibold transition-all duration-200",
                isBuyer
                  ? "bg-[#FFFFFF] text-[#3A5FCD] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]/70"
              )}
            >
              <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
              Buyer
            </button>
            <button
              onClick={() => setActiveWorkspace("creator")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-[7px] px-3 py-2 text-[13px] font-semibold transition-all duration-200",
                !isBuyer
                  ? "bg-[#FFFFFF] text-[#3A5FCD] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]/70"
              )}
            >
              <Lightbulb className="h-3.5 w-3.5 shrink-0" />
              Creator
            </button>
          </div>
        </div>

        <nav className="flex flex-col px-4 py-2 flex-1 overflow-y-auto">
          {/* Primary workspace links */}
          {isBuyer ? (
            <>
              <p className="px-3.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/35">
                Buyer
              </p>
              <div className="flex flex-col gap-0.5">
                {BUYER_LINKS.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
              </div>

              {/* Collapsed inactive workspace */}
              <div className="my-2 h-px bg-[#D9DCE3]" />
              <Link
                href="/creator"
                className="flex items-center gap-2 rounded-[8px] px-3.5 py-2.5 text-[13px] font-medium text-[#1A1A1A]/50 transition-all hover:bg-[#FFFFFF] hover:text-[#3A5FCD] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <Lightbulb className="h-4 w-4 shrink-0" />
                Switch to Creator
                <ArrowLeftRight className="ml-auto h-3.5 w-3.5 shrink-0" />
              </Link>
            </>
          ) : (
            <>
              <p className="px-3.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/35">
                Creator
              </p>
              <div className="flex flex-col gap-0.5">
                {CREATOR_LINKS.map((link) => (
                  <NavLink key={link.href} {...link} />
                ))}
              </div>

              {/* Collapsed inactive workspace */}
              <div className="my-2 h-px bg-[#D9DCE3]" />
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-[8px] px-3.5 py-2.5 text-[13px] font-medium text-[#1A1A1A]/50 transition-all hover:bg-[#FFFFFF] hover:text-[#3A5FCD] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                Switch to Buyer
                <ArrowLeftRight className="ml-auto h-3.5 w-3.5 shrink-0" />
              </Link>
            </>
          )}

          {/* Account section */}
          <div className="my-2 h-px bg-[#D9DCE3]" />
          <p className="px-3.5 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/35">
            Account
          </p>
          <div className="flex flex-col gap-0.5">
            {ACCOUNT_LINKS.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="my-2 h-px bg-[#D9DCE3]" />
              <Link
                href="/admin"
                className={cn(
                  "mt-1 flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  pathname.startsWith("/admin")
                    ? "bg-red-500/10 text-red-600"
                    : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                )}
              >
                <Shield
                  className={cn(
                    "h-4 w-4 shrink-0",
                    pathname.startsWith("/admin") ? "text-red-500" : "text-[#1A1A1A]/50"
                  )}
                />
                Admin Panel
                <span className="ml-auto flex h-4 min-w-[28px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                  ADMIN
                </span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="flex flex-col border-b border-[#D9DCE3] bg-[#FFFFFF] md:hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        {/* Mobile workspace switcher */}
        <div className="flex items-center gap-3 border-b border-[#D9DCE3] px-4 py-2.5">
          <ArrowLeftRight className="h-3.5 w-3.5 shrink-0 text-[#1A1A1A]/40" />
          <div className="flex gap-1.5 rounded-[8px] bg-[#F0F1F5] p-0.5">
            <button
              onClick={() => setActiveWorkspace("buyer")}
              className={cn(
                "flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-semibold transition-all duration-200",
                isBuyer
                  ? "bg-[#FFFFFF] text-[#3A5FCD] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-[#1A1A1A]/50"
              )}
            >
              <ShoppingBag className="h-3 w-3 shrink-0" />
              Buyer
            </button>
            <button
              onClick={() => setActiveWorkspace("creator")}
              className={cn(
                "flex items-center gap-1.5 rounded-[6px] px-3 py-1.5 text-[12px] font-semibold transition-all duration-200",
                !isBuyer
                  ? "bg-[#FFFFFF] text-[#3A5FCD] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                  : "text-[#1A1A1A]/50"
              )}
            >
              <Lightbulb className="h-3 w-3 shrink-0" />
              Creator
            </button>
          </div>
        </div>

        {/* Mobile nav links - show active workspace */}
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-2 px-4 py-3">
            {(isBuyer ? BUYER_LINKS : CREATOR_LINKS).map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              const isNotifications = href === "/dashboard/notifications";
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[8px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                    isActive
                      ? "bg-[#3A5FCD]/10 text-[#3A5FCD]"
                      : "bg-[#F5F6FA] text-[#1A1A1A]/70 hover:bg-[#E8EBF2] hover:text-[#1A1A1A]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {isNotifications && unreadCount > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="mx-1 my-auto h-5 w-px shrink-0 bg-[#D9DCE3]" />

            {/* Account links always visible */}
            {ACCOUNT_LINKS.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[8px] px-4 py-2.5 text-[14px] font-medium transition-colors",
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
                  "flex shrink-0 items-center gap-2 rounded-[8px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-red-500/10 text-red-600"
                    : "bg-[#F5F6FA] text-[#1A1A1A]/70 hover:bg-[#E8EBF2] hover:text-[#1A1A1A]"
                )}
              >
                <Shield className="h-4 w-4" />
                Admin
                <span className="flex h-4 min-w-[28px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
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

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUnreadCount } from "@/features/notifications/actions";
import { getIsAdmin } from "@/features/admin/actions";

const NAV_LINKS = [
  { href: "/dashboard", label: "My Purchases", icon: ShoppingBag, exact: true },
  { href: "/dashboard/insights", label: "Buyer Insights", icon: PieChart, exact: false },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, exact: false },
  { href: "/dashboard/bookmarks", label: "Saved Ideas", icon: Bookmark, exact: false },
  { href: "/dashboard/wallet", label: "My Wallet", icon: Wallet2, exact: false },
  { href: "/creator", label: "Creator Studio", icon: LayoutDashboard, exact: true },
  { href: "/creator/wallet", label: "Earnings", icon: Wallet2, exact: false },
  { href: "/creator/ideas/new", label: "Create Idea", icon: PlusCircle, exact: true },
  { href: "/creator/analytics", label: "Analytics", icon: BarChart3, exact: false },
  { href: "/creator/connect", label: "Stripe Connect", icon: CreditCard, exact: false },
  { href: "/settings", label: "Settings", icon: Settings, exact: false },
];

export function CreatorSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-[#D9DCE3] bg-[#F5F6FA]/50 md:flex md:flex-col">
        <div className="flex h-[72px] items-center gap-3 border-b border-[#D9DCE3] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#FFFFFF] border border-[#D9DCE3] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <Lightbulb className="h-4 w-4 text-[#3A5FCD]" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-[#1A1A1A]">
            Dashboard
          </span>
        </div>
        
        <nav className="flex flex-col gap-1.5 p-4">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            const isNotifications = href === "/dashboard/notifications";
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#3A5FCD]/10 text-[#3A5FCD]"
                    : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", isActive ? "text-[#3A5FCD]" : "text-[#1A1A1A]/50")} />
                {label}
                {isNotifications && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="my-2 h-px bg-[#D9DCE3]" />
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  pathname.startsWith("/admin")
                    ? "bg-red-500/10 text-red-600"
                    : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                )}
              >
                <Shield
                  className={cn(
                    "h-4 w-4",
                    pathname.startsWith("/admin")
                      ? "text-red-500"
                      : "text-[#1A1A1A]/50"
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
      <div className="flex overflow-x-auto border-b border-[#D9DCE3] bg-[#FFFFFF] px-4 md:hidden no-scrollbar shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex gap-2 py-3">
          {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
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
    </>
  );
}

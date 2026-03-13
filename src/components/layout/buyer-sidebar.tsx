"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ShoppingBag,
  PieChart,
  Bookmark,
  Wallet2,
  Bell,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUnreadCount } from "@/features/notifications/actions";

const BUYER_NAV = [
  { href: "/my", label: "My Library", icon: ShoppingBag, exact: true },
  { href: "/my/saved", label: "Saved Ideas", icon: Bookmark, exact: false },
  { href: "/my/activity", label: "Activity", icon: PieChart, exact: false },
  { href: "/my/wallet", label: "Wallet", icon: Wallet2, exact: false },
  { href: "/my/notifications", label: "Notifications", icon: Bell, exact: false },
];

export function BuyerSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
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
    <aside className="hidden md:flex w-52 lg:w-56 shrink-0 flex-col border-r border-border bg-card sticky top-[72px] self-start h-[calc(100vh-72px)] overflow-y-auto">
      <nav className="flex flex-col gap-0.5 p-3 pt-5">
        {BUYER_NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          const isNotifications = href === "/my/notifications";

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-[14px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/60 hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : "text-foreground/50"
                )}
              />
              <span className="flex-1">{label}</span>
              {isNotifications && unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-border p-3">
        <Link
          href="/studio"
          className="flex items-center gap-3 rounded-[9px] px-3 py-2.5 text-[14px] font-medium text-foreground/50 transition-all duration-200 hover:bg-muted hover:text-foreground"
        >
          <Lightbulb className="h-4 w-4 shrink-0" />
          Creator Studio
        </Link>
      </div>
    </aside>
  );
}

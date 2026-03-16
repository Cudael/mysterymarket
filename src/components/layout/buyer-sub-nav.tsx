"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, PieChart, Bookmark, Wallet2, Bell, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUnreadCount } from "@/features/notifications/actions";

const BUYER_TABS = [
  { href: "/my", label: "My Library", icon: ShoppingBag, exact: true },
  { href: "/my/activity", label: "Activity", icon: PieChart, exact: false },
  { href: "/my/saved", label: "Saved Ideas", icon: Bookmark, exact: false },
  { href: "/my/reviews", label: "Reviews", icon: Star, exact: false },
  { href: "/my/wallet", label: "Wallet", icon: Wallet2, exact: false },
  { href: "/my/notifications", label: "Notifications", icon: Bell, exact: false },
];

export function BuyerSubNav() {
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
    <div className="sticky top-[72px] z-40 w-full border-b border-border bg-card shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-10">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-1 py-2">
            {BUYER_TABS.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);
              const isNotifications = href === "/my/notifications";

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-[9px] px-4 py-2 text-[14px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/60 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-foreground/50")} />
                  {label}
                  {isNotifications && unreadCount > 0 && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

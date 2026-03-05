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
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reports", label: "Reports", icon: Flag, exact: false },
  { href: "/admin/refunds", label: "Refunds", icon: DollarSign, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/ideas", label: "Ideas", icon: Lightbulb, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-[#D9DCE3] bg-[#F5F6FA]/50 md:flex md:flex-col">
        <div className="flex h-[72px] items-center gap-3 border-b border-[#D9DCE3] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-red-500/10 border border-red-500/20">
            <Shield className="h-4 w-4 text-red-500" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold tracking-tight text-[#1A1A1A]">
              Admin
            </span>
            <span className="inline-flex items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
              ADMIN
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 p-4">
          {ADMIN_NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-red-500/10 text-red-600"
                    : "text-[#1A1A1A]/70 hover:bg-[#FFFFFF] hover:text-[#1A1A1A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-red-500" : "text-[#1A1A1A]/50"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 border-t border-[#D9DCE3]">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-[14px] font-medium text-[#1A1A1A]/60 transition-all hover:bg-[#FFFFFF] hover:text-[#1A1A1A]"
          >
            <LayoutDashboard className="h-4 w-4 text-[#1A1A1A]/40" />
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Mobile horizontal nav */}
      <div className="flex overflow-x-auto border-b border-[#D9DCE3] bg-[#FFFFFF] px-4 md:hidden no-scrollbar shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex gap-2 py-3">
          {ADMIN_NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-[8px] px-4 py-2.5 text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-red-500/10 text-red-600"
                    : "bg-[#F5F6FA] text-[#1A1A1A]/70 hover:bg-[#E8EBF2] hover:text-[#1A1A1A]"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

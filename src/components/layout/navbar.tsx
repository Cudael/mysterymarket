"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, Lightbulb, ShoppingBag, PieChart, Bookmark, Wallet2, Bell, Settings } from "lucide-react";
import {
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { UserDropdown } from "@/components/layout/user-dropdown";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/auth-modal";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { IdeaVexLogo } from "@/components/shared/ideavex-logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Marketplace" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const MOBILE_BUYER_LINKS = [
  { href: "/my", label: "My Library", icon: ShoppingBag },
  { href: "/my/activity", label: "Activity", icon: PieChart },
  { href: "/my/saved", label: "Saved Ideas", icon: Bookmark },
  { href: "/my/wallet", label: "Wallet", icon: Wallet2 },
  { href: "/my/notifications", label: "Notifications", icon: Bell },
];

export function Navbar() {
  const pathname = usePathname();
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "sign-in" | "sign-up" }>({
    open: false,
    tab: "sign-in",
  });
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[hsl(252,32%,4%)]/90 backdrop-blur-md shadow-[0_4px_32px_rgba(0,0,0,0.40)] transition-all duration-300">
      <div className="container mx-auto flex h-[68px] items-center justify-between px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <IdeaVexLogo size={32} className="transition-transform duration-500 group-hover:scale-110" />
          <span className="font-brand text-[18px] text-white/90 group-hover:text-white transition-colors">
            IdeaVex
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-[14px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                  isActive
                    ? "text-white"
                    : "text-white/45 hover:text-white/80"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[26px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedIn>
            <Link
              href="/my"
              className={cn(
                "text-[14px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                pathname.startsWith("/my") ? "text-white" : "text-white/45 hover:text-white/80"
              )}
            >
              My Library
            </Link>
            <Link
              href="/creator"
              className={cn(
                "flex items-center gap-1.5 text-[14px] font-medium transition-all duration-200 hover:-translate-y-[1px]",
                pathname.startsWith("/creator") ? "text-white" : "text-white/45 hover:text-white/80"
              )}
            >
              <Lightbulb className="h-4 w-4 shrink-0" />
              Creator Studio
            </Link>
            <div className="h-4 w-px bg-white/[0.08] mx-0.5"></div>
            <NotificationBell />
            <UserDropdown />
          </SignedIn>
          <SignedOut>
            <Button
              variant="ghost"
              onClick={() => setAuthModal({ open: true, tab: "sign-in" })}
              className="h-9 px-4 text-[14px] font-medium text-white/50 hover:text-white hover:bg-white/[0.06] rounded-full"
            >
              Log In
            </Button>
            <Button
              onClick={() => setAuthModal({ open: true, tab: "sign-up" })}
              className="h-9 px-5 text-[14px] font-medium bg-primary hover:bg-primary/90 text-white rounded-full shadow-[var(--shadow-primary-glow)] transition-all hover:-translate-y-[1px]"
            >
              Start Creating
            </Button>
          </SignedOut>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-3 md:hidden">
          <SignedIn>
            <NotificationBell />
            <UserDropdown />
          </SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-white/50 hover:text-white hover:bg-white/[0.06] rounded-xl">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[290px] border-l border-white/[0.07] bg-[hsl(252,32%,5%)] p-6 shadow-[-8px_0_40px_rgba(0,0,0,0.60)]">
              <SheetHeader className="border-b border-white/[0.07] pb-5 mb-5 text-left">
                <SheetTitle className="text-[17px] font-bold text-white flex items-center gap-2">
                  <IdeaVexLogo size={28} />
                  <span className="font-brand">IdeaVex</span>
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors",
                        isActive
                          ? "bg-white/[0.06] text-white"
                          : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                
                <SignedOut>
                  <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-white/[0.07]">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-white/[0.10] bg-white/[0.03] text-white/65 hover:text-white hover:bg-white/[0.06] rounded-xl"
                      onClick={() => setAuthModal({ open: true, tab: "sign-in" })}
                    >
                      Log In
                    </Button>
                    <Button
                      className="w-full justify-center bg-primary hover:bg-primary/90 text-white rounded-xl shadow-[var(--shadow-primary-glow)]"
                      onClick={() => setAuthModal({ open: true, tab: "sign-up" })}
                    >
                      Start Creating
                    </Button>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="border-t border-white/[0.07] pt-3 mt-2 flex flex-col gap-0.5">
                    {/* My Library section */}
                    <button
                      type="button"
                      onClick={() => setMobileLibraryOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/50 hover:bg-white/[0.04] hover:text-white/80 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 shrink-0" />
                        My Library
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${mobileLibraryOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {mobileLibraryOpen && (
                      <div className="mt-0.5 flex flex-col gap-0.5 pl-2">
                        {MOBILE_BUYER_LINKS.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-white/40 hover:bg-white/[0.05] hover:text-white/75 transition-colors"
                            >
                              <Icon className="h-4 w-4 shrink-0 text-primary/60" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Creator Studio */}
                    <Link
                      href="/creator"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/50 hover:bg-white/[0.04] hover:text-white/80 transition-colors"
                    >
                      <Lightbulb className="h-4 w-4 shrink-0" />
                      Creator Studio
                    </Link>

                    {/* Account */}
                    <Link
                      href="/account"
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] font-medium text-white/50 hover:bg-white/[0.04] hover:text-white/80 transition-colors"
                    >
                      <Settings className="h-4 w-4 shrink-0" />
                      Account
                    </Link>
                  </div>
                </SignedIn>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <AuthModal
        open={authModal.open}
        onOpenChange={(open) => setAuthModal((prev) => ({ ...prev, open }))}
        defaultTab={authModal.tab}
      />
    </header>
  );
}


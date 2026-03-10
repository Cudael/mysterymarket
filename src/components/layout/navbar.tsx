"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, ChevronDown, ChevronRight, Lightbulb, ShoppingBag, PieChart, Bookmark, Wallet2, Bell, Settings } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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
import { CategoryDropdown } from "@/components/layout/category-dropdown";
import { NAV_CATEGORIES } from "@/lib/category-nav";

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
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "sign-in" | "sign-up" }>({
    open: false,
    tab: "sign-in",
  });
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[8px] bg-primary transition-all duration-300 group-hover:bg-primary/90 group-hover:shadow-[var(--shadow-primary-glow)]">
            <Sparkles className="h-4.5 w-4.5 text-[hsl(var(--gold))] transition-transform duration-500 group-hover:scale-110" />
          </div>
          <span className="text-[19px] font-bold tracking-tight text-foreground">
            MysteryMarket
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-[1px]"
            >
              {link.label}
            </Link>
          ))}
          <CategoryDropdown />
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <SignedIn>
            <Link
              href="/my"
              className="text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-[1px]"
            >
              My Library
            </Link>
            <Link
              href="/studio"
              className="flex items-center gap-1.5 text-[15px] font-medium text-muted-foreground transition-all duration-200 hover:text-primary hover:-translate-y-[1px]"
            >
              <Lightbulb className="h-4 w-4 shrink-0" />
              Creator Studio
            </Link>
            <div className="h-5 w-px bg-border mx-1"></div>
            <NotificationBell />
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-muted transition-all hover:ring-primary/30"
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <Button
              variant="ghost"
              onClick={() => setAuthModal({ open: true, tab: "sign-in" })}
              className="h-10 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Log In
            </Button>
            <Button
              onClick={() => setAuthModal({ open: true, tab: "sign-up" })}
              className="h-10 px-5 text-[15px] font-medium bg-primary hover:bg-primary/90 text-white shadow-[var(--shadow-primary-glow)] transition-all hover:-translate-y-[1px]"
            >
              Start Creating
            </Button>
          </SignedOut>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-4 md:hidden">
          <SignedIn>
            <NotificationBell />
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border bg-card p-6 shadow-[-8px_0_30px_rgba(0,0,0,0.04)]">
              <SheetHeader className="border-b border-border pb-6 mb-6 text-left">
                <SheetTitle className="text-[18px] font-bold text-foreground flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-primary">
                    <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--gold))]" />
                  </div>
                  MysteryMarket
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[16px] font-medium text-foreground/80 transition-colors hover:text-primary py-2"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <nav aria-label="Category navigation" className="border-t border-border pt-4 mt-1">
                  <button
                    type="button"
                    onClick={() => setMobileCatsOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-2 text-[16px] font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${mobileCatsOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileCatsOpen && (
                    <div className="mt-2 flex flex-col gap-0.5">
                      {NAV_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <Link
                            key={cat.slug}
                            href={`/ideas/category/${cat.slug}`}
                            className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[14px] font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-primary" />
                            {cat.name}
                            <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/40" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </nav>
                
                <SignedOut>
                  <div className="mt-4 flex flex-col gap-3 pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-border"
                      onClick={() => setAuthModal({ open: true, tab: "sign-in" })}
                    >
                      Log In
                    </Button>
                    <Button
                      className="w-full justify-center bg-primary hover:bg-primary/90 text-white"
                      onClick={() => setAuthModal({ open: true, tab: "sign-up" })}
                    >
                      Start Creating
                    </Button>
                  </div>
                </SignedOut>
                
                <SignedIn>
                  <div className="border-t border-border pt-4 mt-1 flex flex-col gap-1">
                    {/* My Library section */}
                    <button
                      type="button"
                      onClick={() => setMobileLibraryOpen((v) => !v)}
                      className="flex w-full items-center justify-between py-2 text-[16px] font-medium text-foreground/80 hover:text-primary transition-colors"
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
                      <div className="mt-1 flex flex-col gap-0.5 pl-2">
                        {MOBILE_BUYER_LINKS.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[14px] font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                            >
                              <Icon className="h-4 w-4 shrink-0 text-primary" />
                              {link.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    {/* Creator Studio */}
                    <Link
                      href="/studio"
                      className="flex items-center gap-2 py-2 text-[16px] font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      <Lightbulb className="h-4 w-4 shrink-0" />
                      Creator Studio
                    </Link>

                    {/* Account */}
                    <Link
                      href="/account"
                      className="flex items-center gap-2 py-2 text-[16px] font-medium text-foreground/80 hover:text-primary transition-colors"
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


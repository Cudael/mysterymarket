"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, ChevronDown, ChevronRight } from "lucide-react";
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

export function Navbar() {
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "sign-in" | "sign-up" }>({
    open: false,
    tab: "sign-in",
  });
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D9DCE3] bg-[#FFFFFF]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#3A5FCD] transition-all duration-300 group-hover:bg-[#6D7BE0] group-hover:shadow-[0_4px_12px_rgba(58,95,205,0.3)]">
            <Sparkles className="h-4.5 w-4.5 text-[#E8C26A] transition-transform duration-500 group-hover:scale-110" />
          </div>
          <span className="text-[19px] font-bold tracking-tight text-[#1A1A1A]">
            MysteryMarket
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-[#1A1A1A]/70 transition-all duration-200 hover:text-[#3A5FCD] hover:-translate-y-[1px]"
            >
              {link.label}
            </Link>
          ))}
          <CategoryDropdown />
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <SignedIn>
            <Button asChild variant="ghost" className="h-10 text-[15px] font-medium text-[#1A1A1A]/70 hover:text-[#3A5FCD] hover:bg-[#F8F9FC]">
              <Link href="/my">My Library</Link>
            </Button>
            <div className="h-5 w-px bg-[#D9DCE3] mx-2"></div>
            <NotificationBell />
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-[#F5F6FA] transition-all hover:ring-[#3A5FCD]/30"
                }
              }}
            />
          </SignedIn>
          <SignedOut>
            <Button
              variant="ghost"
              onClick={() => setAuthModal({ open: true, tab: "sign-in" })}
              className="h-10 text-[15px] font-medium text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#F8F9FC]"
            >
              Log In
            </Button>
            <Button
              onClick={() => setAuthModal({ open: true, tab: "sign-up" })}
              className="h-10 px-5 text-[15px] font-medium bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all hover:shadow-[0_4px_12px_rgba(58,95,205,0.35)] hover:-translate-y-[1px]"
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
              <Button variant="ghost" size="icon" className="text-[#1A1A1A] hover:bg-[#F5F6FA]">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[-8px_0_30px_rgba(0,0,0,0.04)]">
              <SheetHeader className="border-b border-[#D9DCE3] pb-6 mb-6 text-left">
                <SheetTitle className="text-[18px] font-bold text-[#1A1A1A] flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#3A5FCD]">
                    <Sparkles className="h-3.5 w-3.5 text-[#E8C26A]" />
                  </div>
                  MysteryMarket
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[16px] font-medium text-[#1A1A1A]/80 transition-colors hover:text-[#3A5FCD] py-2"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <nav aria-label="Category navigation" className="border-t border-[#D9DCE3] pt-4 mt-1">
                  <button
                    type="button"
                    onClick={() => setMobileCatsOpen((v) => !v)}
                    className="flex w-full items-center justify-between py-2 text-[16px] font-medium text-[#1A1A1A]/80 hover:text-[#3A5FCD] transition-colors"
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
                            className="flex items-center gap-2.5 rounded-[8px] px-3 py-2 text-[14px] font-medium text-[#1A1A1A]/70 hover:bg-[#F5F6FA] hover:text-[#3A5FCD] transition-colors"
                          >
                            <Icon className="h-4 w-4 shrink-0 text-[#3A5FCD]" />
                            {cat.name}
                            <ChevronRight className="ml-auto h-3.5 w-3.5 text-[#1A1A1A]/30" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </nav>
                
                <SignedOut>
                  <div className="mt-4 flex flex-col gap-3 pt-6 border-t border-[#D9DCE3]">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-[#D9DCE3]"
                      onClick={() => setAuthModal({ open: true, tab: "sign-in" })}
                    >
                      Log In
                    </Button>
                    <Button
                      className="w-full justify-center bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white"
                      onClick={() => setAuthModal({ open: true, tab: "sign-up" })}
                    >
                      Start Creating
                    </Button>
                  </div>
                </SignedOut>
                
                <SignedIn>
                   <div className="mt-4 pt-6 border-t border-[#D9DCE3]">
                      <Button asChild className="w-full justify-center bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white">
                        <Link href="/my">My Library</Link>
                      </Button>
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

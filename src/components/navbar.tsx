"use client";

import Link from "next/link";
import { Sparkles, Menu } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/ideas", label: "Marketplace" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Subtle mystery touch: Golden Hint center inside Mystery Blue */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#3A5FCD] transition-colors group-hover:bg-[#6D7BE0]">
            <Sparkles className="h-4 w-4 text-[#E8C26A]" />
          </div>
          <span className="text-[18px] font-semibold tracking-tight text-[#1A1A1A]">
            MysteryMarket
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[16px] font-medium text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button>Start Creating</Button>
            </SignUpButton>
          </SignedOut>
        </div>

        {/* Mobile menu */}
        <div className="flex items-center gap-4 md:hidden">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#1A1A1A]">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-[#D9DCE3] bg-[#FFFFFF]">
              <SheetHeader className="border-b border-[#D9DCE3] pb-4 text-left">
                <SheetTitle className="text-[18px] font-semibold text-[#1A1A1A]">
                  MysteryMarket
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 pt-6">
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-[8px] px-4 py-3 text-[16px] font-medium text-[#1A1A1A] transition-colors hover:bg-[#F5F6FA] hover:text-[#3A5FCD]"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SignedOut>
                  <div className="mt-8 flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full">Start Creating</Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

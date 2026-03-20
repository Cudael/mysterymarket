"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { ShoppingBag, Lightbulb, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-400">
        ADMIN
      </span>
    );
  }
  if (role === "CREATOR") {
    return (
      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
        CREATOR
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
      USER
    </span>
  );
}

export function UserDropdown() {
  const { user } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  if (!user) return null;

  const displayName = user.fullName || user.firstName || user.username || "";
  const email = user.primaryEmailAddress?.emailAddress ?? "";
  const initials = (displayName || email).charAt(0).toUpperCase() || "?";
  const avatarUrl = user.imageUrl;

  // role comes from publicMetadata set during sync
  const role = (user.publicMetadata?.role as string) ?? "USER";

  function handleSignOut() {
    clerk.signOut(() => router.push("/"));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="User menu"
          className="h-8 w-8 rounded-full ring-1 ring-white/10 transition-all hover:ring-primary/40 hover:shadow-[0_0_12px_rgba(139,92,246,0.25)] cursor-pointer overflow-hidden focus:outline-none"
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName || "User avatar"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 border border-primary/30 text-primary text-[13px] font-semibold">
              {initials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[280px] bg-[hsl(252,32%,5%)] border border-white/[0.07] rounded-[16px] shadow-[0_16px_48px_rgba(0,0,0,0.50),0_0_0_1px_rgba(139,92,246,0.08)] p-1"
      >
        {/* Identity header */}
        <div className="flex items-center gap-3 px-4 py-3.5 select-none">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName || "User avatar"}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full ring-2 ring-primary/20 object-cover shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-2 ring-primary/20 bg-primary/20 border border-primary/30 text-primary text-[15px] font-semibold">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold text-foreground leading-tight truncate">
              {displayName || "User"}
            </p>
            <p className="text-[12px] text-muted-foreground truncate max-w-[160px]">
              {email}
            </p>
            <div className="mt-1">
              <RoleBadge role={role} />
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/[0.06] -mx-1 my-0" />

        {/* Nav items */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={() => router.push("/my")}
            className="rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 focus:bg-white/[0.05] focus:text-white"
          >
            <ShoppingBag className="h-4 w-4 text-primary/70 shrink-0" />
            My Library
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/creator")}
            className="rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 focus:bg-white/[0.05] focus:text-white"
          >
            <Lightbulb className="h-4 w-4 text-primary/70 shrink-0" />
            Creator Studio
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push("/account")}
            className="rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-white/60 hover:bg-white/[0.05] hover:text-white transition-colors cursor-pointer flex items-center gap-2.5 focus:bg-white/[0.05] focus:text-white"
          >
            <Settings className="h-4 w-4 text-primary/70 shrink-0" />
            Account Settings
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-white/[0.06] -mx-1 my-0" />

        {/* Sign out */}
        <div className="py-1">
          <DropdownMenuItem
            onClick={handleSignOut}
            className="rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-red-400/80 hover:bg-red-500/[0.08] hover:text-red-400 transition-colors cursor-pointer flex items-center gap-2.5 focus:bg-red-500/[0.08] focus:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

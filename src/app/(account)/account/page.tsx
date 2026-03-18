"use client";

import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentCard } from "@/components/shared/content-card";
import { updateProfile, getUserByClerkId } from "@/features/users/actions";
import {
  User,
  Link2,
  Bell,
  Shield,
  Wallet2,
  Globe,
  Twitter,
  Linkedin,
  Save,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Section = "profile" | "social" | "notifications" | "account" | "payouts";

const SIDEBAR_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "account", label: "Account", icon: Shield },
  { id: "payouts", label: "Payouts", icon: Wallet2 },
];

function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-400">
        ADMIN
      </span>
    );
  }
  if (role === "CREATOR") {
    return (
      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
        CREATOR
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
      USER
    </span>
  );
}

export default function AccountPage() {
  const { user: clerkUser } = useUser();
  const clerk = useClerk();
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [dbUser, setDbUser] = useState<{
    email: string;
    role: string;
    createdAt: Date;
    stripeAccountId: string | null;
    stripeOnboarded: boolean;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      const u = await getUserByClerkId();
      if (u) {
        setDbUser({
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
          stripeAccountId: u.stripeAccountId,
          stripeOnboarded: u.stripeOnboarded,
        });
        setName(u.name ?? "");
        setBio(u.bio ?? "");
        setTwitterUrl(u.twitterUrl ?? "");
        setLinkedinUrl(u.linkedinUrl ?? "");
        setWebsiteUrl(u.websiteUrl ?? "");
      }
    }
    loadUser();
  }, []);

  function validateUrl(value: string): boolean {
    if (!value) return true;
    return value.startsWith("https://");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name: name || undefined, bio: bio || undefined });
      toast.success("Profile saved successfully");
    } catch (err) {
      console.error("[account] Profile save failed:", err);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveSocial(e: React.FormEvent) {
    e.preventDefault();
    if (!validateUrl(twitterUrl)) {
      toast.error("Twitter URL must start with https://");
      return;
    }
    if (!validateUrl(linkedinUrl)) {
      toast.error("LinkedIn URL must start with https://");
      return;
    }
    if (!validateUrl(websiteUrl)) {
      toast.error("Website URL must start with https://");
      return;
    }
    setIsSavingSocial(true);
    try {
      await updateProfile({
        twitterUrl: twitterUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        websiteUrl: websiteUrl || undefined,
      });
      toast.success("Social links saved successfully");
    } catch (err) {
      console.error("[account] Social links save failed:", err);
      toast.error("Failed to save social links");
    } finally {
      setIsSavingSocial(false);
    }
  }

  const displayName = clerkUser?.fullName || clerkUser?.firstName || clerkUser?.username || name || "";
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? dbUser?.email ?? "";
  const avatarUrl = clerkUser?.imageUrl;
  const role = dbUser?.role ?? "USER";
  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;
  const clerkId = clerkUser?.id ?? "";

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">

      {/* Profile header banner */}
      <div className="mb-8 rounded-[16px] border border-border bg-gradient-to-r from-primary/5 to-transparent p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={displayName || "User avatar"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full ring-2 ring-primary/30 object-cover shrink-0"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full ring-2 ring-primary/30 bg-primary/20 border border-primary/30 text-primary text-[22px] font-bold">
              {(displayName || email).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-bold text-foreground leading-tight">
                {displayName || "Your Account"}
              </h1>
              <RoleBadge role={role} />
            </div>
            <p className="text-[13px] text-muted-foreground mt-0.5">{email}</p>
            {memberSince && (
              <p className="text-[12px] text-muted-foreground/70 mt-0.5">
                Member since {memberSince}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile tab strip */}
      <div className="mb-6 flex gap-1 overflow-x-auto pb-2 lg:hidden no-scrollbar">
        {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-2 text-[12px] font-medium transition-colors whitespace-nowrap",
              activeSection === id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">

        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <nav className="sticky top-[88px] flex flex-col gap-0.5">
            {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveSection(id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium transition-colors text-left w-full",
                  activeSection === id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="space-y-8 min-w-0">

          {/* Section 1: Profile */}
          {activeSection === "profile" && (
            <ContentCard title="Public Profile">
              <form onSubmit={handleSave} className="space-y-6">
                <p className="text-[13px] text-muted-foreground">
                  Profile photo is managed via your{" "}
                  <button
                    type="button"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                    onClick={() => clerk.openUserProfile()}
                  >
                    Clerk account settings
                  </button>
                  .
                </p>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[14px] font-medium text-foreground">
                    Display Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="h-10 rounded-[8px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-[14px] font-medium text-foreground">
                    Bio / About
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell buyers about your expertise..."
                    rows={5}
                    className="rounded-[8px] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </ContentCard>
          )}

          {/* Section 2: Social Links */}
          {activeSection === "social" && (
            <ContentCard
              title="Social Links"
            >
              <p className="text-[13px] text-muted-foreground mb-6">
                These are shown on your public creator profile.
              </p>
              <form onSubmit={handleSaveSocial} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="twitterUrl" className="text-[14px] font-medium text-foreground">
                    Twitter / X
                  </Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="twitterUrl"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/yourusername"
                      className="h-10 rounded-[8px] pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="text-[14px] font-medium text-foreground">
                    LinkedIn
                  </Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="linkedinUrl"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourusername"
                      className="h-10 rounded-[8px] pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl" className="text-[14px] font-medium text-foreground">
                    Website
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="websiteUrl"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="h-10 rounded-[8px] pl-10"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isSavingSocial}>
                    {isSavingSocial ? (
                      "Saving..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Social Links
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </ContentCard>
          )}

          {/* Section 3: Notifications */}
          {activeSection === "notifications" && (
            <ContentCard title="Notification Preferences">
              <div className="space-y-4">
                {[
                  { label: "Email me when someone purchases my idea", defaultChecked: true },
                  { label: "Email me when I receive a new review", defaultChecked: true },
                  { label: "Platform updates and announcements", defaultChecked: false },
                ].map(({ label, defaultChecked }) => (
                  <label
                    key={label}
                    className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-muted/40 px-4 py-3 cursor-pointer hover:bg-muted/60 transition-colors"
                  >
                    <span className="text-[14px] text-foreground">{label}</span>
                    <input
                      type="checkbox"
                      defaultChecked={defaultChecked}
                      className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                    />
                  </label>
                ))}
              </div>
              <p className="mt-5 text-[12px] text-muted-foreground">
                Email notification settings will be available in a future update.
              </p>
            </ContentCard>
          )}

          {/* Section 4: Account & Security */}
          {activeSection === "account" && (
            <ContentCard title="Account &amp; Security">
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Email Address
                    </p>
                    <p className="text-[14px] font-medium text-foreground">{email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Account Role
                    </p>
                    <RoleBadge role={role} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Member Since
                    </p>
                    <p className="text-[14px] text-foreground/80">
                      {dbUser?.createdAt
                        ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Account ID
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground truncate max-w-[200px]" title={clerkId}>
                      {clerkId ? `${clerkId.slice(0, 24)}…` : "—"}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="outline" onClick={() => clerk.openUserProfile()}>
                    Manage Password &amp; Security
                  </Button>
                </div>

                {/* Danger zone */}
                <div className="mt-6 rounded-[10px] border border-red-500/20 bg-red-500/[0.03] p-4">
                  <h3 className="text-[14px] font-semibold text-red-400 mb-1">Danger Zone</h3>
                  <p className="text-[13px] text-muted-foreground mb-4">
                    Deleting your account is permanent and will remove all your data. Contact support to delete your account.
                  </p>
                  <Button
                    asChild
                    className="bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                    variant="destructive"
                  >
                    <a href="mailto:support@ideavex.com">Contact Support</a>
                  </Button>
                </div>
              </div>
            </ContentCard>
          )}

          {/* Section 5: Payouts */}
          {activeSection === "payouts" && (
            <div>
              {dbUser?.stripeOnboarded ? (
                <div className="rounded-[12px] border border-emerald-500/20 bg-emerald-500/[0.03] overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-foreground">Stripe Connected</h3>
                        <p className="text-[13px] text-muted-foreground mt-1">
                          Your account is active and ready to receive payouts. Payouts are processed automatically when your balance reaches the minimum threshold.
                        </p>
                        <div className="mt-4">
                          <Button asChild variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-400">
                            <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                              View Stripe Dashboard <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[12px] border border-amber-500/20 bg-amber-500/[0.03] overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
                        <Wallet2 className="h-5 w-5 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-foreground">Connect Stripe to Receive Payouts</h3>
                        <p className="text-[13px] text-muted-foreground mt-1">
                          Connect your Stripe account to start earning from your ideas. You&apos;ll need a Stripe account to receive payouts when buyers purchase your ideas.
                        </p>
                        <div className="mt-4">
                          <Button asChild>
                            <a href="/studio/payouts">
                              Connect Stripe <AlertCircle className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


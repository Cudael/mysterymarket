"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { updateProfile, getUserByClerkId } from "@/features/users/actions";
import { User, Mail, ShieldAlert, CreditCard, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);
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
      }
    }
    loadUser();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ name: name || undefined, bio: bio || undefined });
      toast.success("Profile saved successfully");
    } catch (err) {
      console.error("[settings] Profile save failed:", err);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Settings</h1>
        <p className="mt-2 text-[15px] text-[#1A1A1A]/60">
          Manage your account preferences, public profile, and integrations.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4 flex items-center gap-2">
            <User className="h-4 w-4 text-[#3A5FCD]" />
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Public Profile</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[14px] font-medium text-[#1A1A1A]">Display Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name..."
                  className="h-10 rounded-[8px] border-[#D9DCE3] bg-[#F8F9FC] focus:bg-[#FFFFFF] focus:border-[#3A5FCD] focus:ring-[#3A5FCD]/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[14px] font-medium text-[#1A1A1A]">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell buyers about yourself..."
                  rows={4}
                  className="resize-none rounded-[8px] border-[#D9DCE3] bg-[#F8F9FC] focus:bg-[#FFFFFF] focus:border-[#3A5FCD] focus:ring-[#3A5FCD]/20 transition-all"
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#3A5FCD] text-[#FFFFFF] hover:bg-[#3A5FCD]/90 h-10 px-6 font-medium shadow-[0_2px_8px_rgba(58,95,205,0.2)]"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </div>
        </section>

        {/* Account Info Section */}
        <section className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#3A5FCD]" />
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Account Information</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-[13px] font-medium text-[#1A1A1A]/60 uppercase tracking-wide">Email Address</dt>
                <dd className="mt-1.5 text-[15px] font-medium text-[#1A1A1A]">
                  {clerkUser?.primaryEmailAddress?.emailAddress ?? dbUser?.email ?? "—"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-[13px] font-medium text-[#1A1A1A]/60 uppercase tracking-wide">Account Role</dt>
                <dd className="mt-1.5">
                  <Badge variant="outline" className="bg-[#F8F9FC] text-[#1A1A1A] border-[#D9DCE3] font-medium">
                    {dbUser?.role ?? "USER"}
                  </Badge>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[13px] font-medium text-[#1A1A1A]/60 uppercase tracking-wide">Member Since</dt>
                <dd className="mt-1.5 text-[15px] text-[#1A1A1A]">
                  {dbUser?.createdAt
                    ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Stripe Connect Section */}
        <section className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#3A5FCD]" />
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Payouts & Billing</h2>
          </div>
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[15px] text-[#1A1A1A] font-medium">Stripe Connect Account</p>
              <p className="text-[14px] text-[#1A1A1A]/60 mt-1">
                Receive earnings directly to your bank account securely via Stripe.
              </p>
            </div>
            
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              {dbUser?.stripeOnboarded ? (
                <>
                  <Badge className="bg-[#E8F5E9] text-[#054F31] border-[#C8E6C9] px-3 py-1 text-[13px] self-start sm:self-end">
                    Connected
                  </Badge>
                  <a
                    href="https://dashboard.stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[14px] font-medium text-[#3A5FCD] hover:text-[#6D7BE0] transition-colors"
                  >
                    Stripe Dashboard <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="bg-[#FFF8E1] text-[#795548] border-[#FFECB3] px-3 py-1 text-[13px] self-start sm:self-end">
                    Not Connected
                  </Badge>
                  <a 
                    href="/creator/connect" 
                    className="text-[14px] font-medium text-[#3A5FCD] hover:text-[#6D7BE0] transition-colors hover:underline"
                  >
                    Setup Payouts
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-[12px] border border-[#FFEAEA] bg-[#FFFAFA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#FFEAEA] bg-[#FFF0F0] px-6 py-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#D32F2F]" />
            <h2 className="text-[16px] font-semibold text-[#D32F2F]">Danger Zone</h2>
          </div>
          <div className="p-6">
            <p className="text-[14px] text-[#1A1A1A]/70">
              Account deletion and data export options are currently handled through support. 
              Contact us if you need to permanently remove your account.
            </p>
            <div className="mt-4">
              <Button variant="destructive" disabled className="bg-[#D32F2F]/50 text-[#FFFFFF] opacity-50 cursor-not-allowed">
                Delete Account
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

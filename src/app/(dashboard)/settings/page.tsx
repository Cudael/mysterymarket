"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, getUserByClerkId } from "@/features/users/actions";
import { CheckCircle2, AlertCircle, Save, ExternalLink } from "lucide-react";

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
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Settings</h1>
        <p className="mt-2 text-[15px] text-[#1A1A1A]/60">
          Manage your public profile and account preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Card */}
        <section className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Public Profile</h2>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[14px] font-medium text-[#1A1A1A]">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="h-10 rounded-[8px] border-[#D9DCE3] bg-[#F8F9FC] text-[15px] text-[#1A1A1A] transition-colors focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#3A5FCD]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-[14px] font-medium text-[#1A1A1A]">Biography</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell buyers about your expertise..."
                rows={4}
                className="rounded-[8px] border-[#D9DCE3] bg-[#F8F9FC] text-[15px] text-[#1A1A1A] resize-none transition-colors focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-1 focus:ring-[#3A5FCD]/20"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white font-medium px-6 h-10 shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all"
              >
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
        </section>

        {/* Account Info Card */}
        <section className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Account Details</h2>
          </div>
          
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-[13px] font-medium uppercase tracking-wider text-[#1A1A1A]/50">Email Address</dt>
                <dd className="mt-1 text-[15px] font-medium text-[#1A1A1A]">
                  {clerkUser?.primaryEmailAddress?.emailAddress ?? dbUser?.email ?? "—"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-[13px] font-medium uppercase tracking-wider text-[#1A1A1A]/50">Account Role</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center rounded-[6px] bg-[#F5F6FA] px-2.5 py-1 text-[13px] font-semibold text-[#1A1A1A] border border-[#D9DCE3]">
                    {dbUser?.role ?? "USER"}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-[13px] font-medium uppercase tracking-wider text-[#1A1A1A]/50">Member Since</dt>
                <dd className="mt-1 text-[15px] text-[#1A1A1A]/80">
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

        {/* Stripe Connect Card */}
        <section className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[16px] font-semibold text-[#1A1A1A]">Payouts & Stripe</h2>
          </div>
          
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {dbUser?.stripeOnboarded ? (
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Stripe Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600 font-medium">
                  <AlertCircle className="h-5 w-5" />
                  <span>Stripe Not Connected</span>
                </div>
              )}
              <p className="mt-1 text-[14px] text-[#1A1A1A]/60">
                {dbUser?.stripeOnboarded 
                  ? "Your account is active and ready to receive payouts." 
                  : "Connect your Stripe account to start earning from your ideas."}
              </p>
            </div>

            <Button 
              asChild 
              variant={dbUser?.stripeOnboarded ? "outline" : "default"}
              className={dbUser?.stripeOnboarded 
                ? "bg-[#FFFFFF] border-[#D9DCE3] text-[#1A1A1A]" 
                : "bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
              }
            >
              {dbUser?.stripeOnboarded ? (
                <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
                  View Stripe Dashboard <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              ) : (
                <a href="/creator/connect">
                  Connect Stripe
                </a>
              )}
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}

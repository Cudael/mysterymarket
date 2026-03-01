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
import { updateProfile, getUserByClerkId } from "@/actions/users";

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
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account preferences.
      </p>

      <Separator className="my-6" />

      <section>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell buyers about yourself..."
              rows={3}
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="text-lg font-semibold text-foreground">Account Info</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-foreground">{clerkUser?.primaryEmailAddress?.emailAddress ?? dbUser?.email ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Role</dt>
            <dd>
              <Badge variant="secondary">{dbUser?.role ?? "USER"}</Badge>
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Member Since</dt>
            <dd className="text-foreground">
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
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="text-lg font-semibold text-foreground">Stripe Connect</h2>
        <div className="mt-4 flex items-center gap-3">
          {dbUser?.stripeOnboarded ? (
            <>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Open Stripe Dashboard ↗
              </a>
            </>
          ) : (
            <>
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                Not Connected
              </Badge>
              <a href="/creator/connect" className="text-sm text-primary hover:underline">
                Connect Stripe to receive payments
              </a>
            </>
          )}
        </div>
      </section>

      <Separator className="my-6" />

      <section>
        <h2 className="text-lg font-semibold text-foreground">Danger Zone</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Account deletion and data export options coming soon.
        </p>
      </section>
    </div>
  );
}

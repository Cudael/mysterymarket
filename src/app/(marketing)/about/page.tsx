import type { Metadata } from "next";
import { Lightbulb, Users, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About - MysteryIdea",
  description: "Learn about the MysteryIdea premium idea marketplace.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground">
          About MysteryIdea
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          MysteryIdea is a premium marketplace where creators monetize their
          best ideas and buyers gain access to exclusive insights.
        </p>

        {/* Mission */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground">
            Our Mission
          </h2>
          <p className="mt-3 text-muted-foreground">
            Great ideas deserve to be compensated. We built MysteryIdea to
            bridge the gap between creators with valuable knowledge and buyers
            who want to act on it. Every idea is priced by its creator and
            unlocked on demand — no subscriptions, no gatekeeping.
          </p>
        </section>

        {/* How it Works */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground">
            How It Works
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">
                Post an Idea
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Creators write their hidden idea with an optional teaser and set
                a price.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">
                Buyers Unlock
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Interested buyers pay to unlock the full idea content
                instantly.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">
                Secure Payments
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pay via Stripe checkout or use your in-app wallet for instant purchases. Creators earn to their wallet with a 15% platform fee.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground">The Team</h2>
          <p className="mt-3 text-muted-foreground">
            MysteryIdea is built by a small team passionate about creator
            economy tools. We&apos;re actively building in public and welcome
            feedback from our community.
          </p>
        </section>
      </div>
    </div>
  );
}

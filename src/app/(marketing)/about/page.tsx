import type { Metadata } from "next";
import { Lightbulb, Users, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About - IdeaVex",
  description: "Learn about the IdeaVex premium idea marketplace.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-foreground">
          About IdeaVex
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          A marketplace where the best ideas stay hidden — until the right
          person unlocks them.
        </p>

        {/* Mission */}
        <section className="mt-12">
          <div className="mb-4 h-px bg-border" />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Our Mission
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Great ideas deserve to be compensated. We built IdeaVex to
            bridge the gap between creators with valuable knowledge and buyers
            who want to act on it. Every idea is priced by its creator and
            unlocked on demand — no subscriptions, no gatekeeping.
          </p>
        </section>

        {/* How it Works */}
        <section className="mt-12">
          <div className="mb-4 h-px bg-border" />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            How It Works
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[20px] border border-border bg-surface p-6 transition-all hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(232,194,106,0.08)]">
              <Lightbulb className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">
                Post an Idea
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Creators write their hidden idea with an optional teaser and
                set a price.
              </p>
            </div>
            <div className="rounded-[20px] border border-border bg-surface p-6 transition-all hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(232,194,106,0.08)]">
              <Users className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">
                Buyers Unlock
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Interested buyers pay to unlock the full idea content
                instantly.
              </p>
            </div>
            <div className="rounded-[20px] border border-border bg-surface p-6 transition-all hover:border-gold/30 hover:shadow-[0_4px_20px_rgba(232,194,106,0.08)]">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="mt-3 font-semibold text-foreground">
                Secure Payments
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Pay via Stripe checkout or use your in-app wallet for instant
                purchases. Creators earn to their wallet with a 15% platform
                fee.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mt-12">
          <div className="mb-4 h-px bg-border" />
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            The Team
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            IdeaVex is built by a small team passionate about the creator
            economy. We&apos;re building in public and welcome feedback from
            our community.
          </p>
        </section>
      </div>
    </div>
  );
}

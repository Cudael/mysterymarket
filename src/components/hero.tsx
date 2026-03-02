import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32 lg:pb-40">
      {/* Subtle background grid pattern for depth without "vibes" */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
              <Lightbulb className="h-4 w-4 text-foreground" />
              <span className="text-foreground">Premium Idea Marketplace</span>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Ideas worth <span className="text-primary/70 underline decoration-border underline-offset-8">paying for.</span>
          </h1>

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Discover exclusive insights from top creators. Post your hidden ideas, set your price, and earn every time someone unlocks your brilliance.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2 h-12 px-8">
              <Link href="/ideas">
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8">
              <Link href="/sign-up">Start Selling</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No subscriptions. Pay only for what you unlock.
          </p>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 lg:pt-32 lg:pb-40">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Ideas worth{" "}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                paying for.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Discover exclusive insights from top creators. Post your hidden ideas, 
              set your price, and earn every time someone unlocks your brilliance.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto gap-2 h-14 px-8 text-base shadow-lg shadow-primary/20 transition-transform hover:-translate-y-1">
                <Link href="/ideas">
                  Browse Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base transition-transform hover:-translate-y-1">
                <Link href="/sign-up">Start Selling</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm font-medium text-muted-foreground">
              No subscriptions. Pay only for what you unlock.
            </p>
          </div>

          {/* Right Column: Creative Visual "Action" */}
          <div className="relative hidden lg:block h-[500px] w-full perspective-1000">
            {/* Floating Card 1 (Locked) */}
            <div className="absolute top-10 right-20 z-10 w-72 animate-in slide-in-from-bottom-10 fade-in duration-1000 rotate-[6deg] rounded-2xl border border-border/50 bg-white p-6 shadow-2xl transition-transform hover:rotate-0 hover:scale-105">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded-md bg-muted"></div>
                <div className="h-4 w-1/2 rounded-md bg-muted"></div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border">
                  <span className="font-bold text-foreground">$15.00</span>
                  <div className="h-8 w-20 rounded-full bg-primary/20"></div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 (Unlocked) */}
            <div className="absolute bottom-10 left-10 z-20 w-80 animate-in slide-in-from-bottom-20 fade-in duration-1000 delay-200 -rotate-[4deg] rounded-2xl border border-primary/20 bg-gradient-to-br from-white to-primary/5 p-6 shadow-xl transition-transform hover:rotate-0 hover:scale-105">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Unlock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">My Q4 Marketing Strategy</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The exact blueprint I used to scale to $10k/MRR in 30 days...
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-primary/10">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-purple-500"></div>
                <div className="text-sm font-medium text-foreground">Unlocked by you</div>
              </div>
            </div>

            {/* Decorative background blur */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, LockOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[hsl(252,40%,6%)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(109,90,230,0.22),transparent_40%),radial-gradient(ellipse_at_85%_15%,rgba(232,194,106,0.08),transparent_40%)]" />

      <div className="container relative mx-auto max-w-[1400px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-gold" />
              Ideas worth keeping secret
            </div>

            <h1 className="mt-6 text-[42px] font-bold tracking-[-0.05em] text-white sm:text-[56px] sm:leading-[1.02]">
              The best ideas{" "}
              <span className="text-gold">aren&apos;t free.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[18px] leading-[1.7] text-white/70 sm:text-[20px]">
              Browse what creators won&apos;t share publicly. Unlock the ideas
              worth paying for.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[10px] bg-gold px-7 text-[15px] font-semibold text-gold-foreground shadow-[var(--shadow-gold-glow)] hover:bg-gold/90"
              >
                <Link href="/ideas">
                  Start exploring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-[10px] border-white/15 bg-white/5 px-7 text-[15px] font-semibold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/sign-up">Start selling</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 -z-10 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 -z-10 h-64 w-64 rounded-full bg-gold/6 blur-3xl" />

            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-md">
              <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[hsl(252,35%,8%)]">
                <div className="relative h-48 w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdGX7NC4IklMBCw7h7LW8-dmEpZyIWK6DANo1n0nVZqIn40XG6VFlxTIGLeBcFshs4X3j8_kuk-My0HY_F7kfvjxZ9yU3yzJyR_MIkp-LAhYMMJBT58sxqyBeCKFZMMZEuVQfggvp5WZ6POU7_sinx1Su3LO5iSuI_ZwrcXsHwmEgwdxxzQN-YYYOFouC841X6V3nT3plRG9oKrLdLYxpcod8w07Ahub-z2Wi2Tgu6WXwed5yMKPm7N1zHBRC-hPtLSPP_RcpB22c"
                    alt="The Next-Gen Micro-SaaS for Remote Teams"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute right-3 top-3 rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold/90 backdrop-blur-sm">
                    Exclusive
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                      E
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Elena R.</p>
                      <p className="text-xs text-white/40">Top Creator</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    The Next-Gen Micro-SaaS for Remote Teams
                  </h3>
                  <div className="mt-3 space-y-1.5">
                    <div className="h-2 w-[85%] rounded-full bg-white/10 blur-[2px]" />
                    <div className="h-2 w-[70%] rounded-full bg-white/[0.07] blur-[2px]" />
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-white/35">Unlock Price</p>
                      <p className="mt-1 text-lg font-semibold text-gold">$2,500</p>
                    </div>
                    <Button size="sm" className="rounded-[8px] bg-gold text-[13px] font-semibold text-gold-foreground hover:bg-gold/90">
                      <LockOpen className="mr-1.5 h-3.5 w-3.5" />
                      Unlock Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

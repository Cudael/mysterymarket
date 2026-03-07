import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FC]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(58,95,205,0.10),transparent_45%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(58,95,205,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(58,95,205,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="container relative mx-auto max-w-[1400px] px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D9DCE3] bg-white px-4 py-2 text-sm font-medium text-[#1A1A1A]/70 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <Sparkles className="h-4 w-4 text-[#3A5FCD]" />
              Premium idea marketplace for serious buyers and creators
            </div>

            <h1 className="mt-6 text-[42px] font-bold tracking-[-0.03em] text-[#111827] sm:text-[56px] sm:leading-[1.02]">
              Buy and sell
              <span className="text-[#3A5FCD]"> high-value ideas </span>
              with clarity, exclusivity, and trust.
            </h1>

            <p className="mt-6 max-w-2xl text-[18px] leading-8 text-[#1A1A1A]/68 sm:text-[20px]">
              MysteryMarket helps experts monetize hard-won insights while giving buyers
              access to premium opportunities, frameworks, and concepts they won’t find in public feeds.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-[10px] bg-[#3A5FCD] px-7 text-[15px] font-semibold hover:bg-[#2D4FB0]">
                <Link href="/ideas">
                  Explore ideas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-[10px] border-[#D9DCE3] bg-white px-7 text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F5F6FA]">
                <Link href="/sign-up">Start selling</Link>
              </Button>
            </div>

            <div className="mt-10 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-[#D9DCE3]/60 bg-white/50 px-5 py-4 text-sm text-[#1A1A1A]/70 shadow-sm sm:flex-nowrap sm:gap-6">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#3A5FCD]" />
                Secure payments
              </div>
              <div className="hidden h-4 w-px bg-[#D9DCE3] sm:block" />
              <div className="flex items-center gap-2 font-medium">
                <Users className="h-4 w-4 text-[#3A5FCD]" />
                Pro community
              </div>
              <div className="hidden h-4 w-px bg-[#D9DCE3] sm:block" />
              <div className="flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4 text-[#3A5FCD]" />
                Curated quality
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 -z-10 h-64 w-64 rounded-full bg-[#3A5FCD]/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 -z-10 h-64 w-64 rounded-full bg-[#E8C26A]/10 blur-3xl" />
            
            <div className="rounded-[24px] border border-[#D9DCE3] border-t-[6px] border-t-[#3A5FCD] bg-white p-6 shadow-[0_24px_80px_rgba(17,24,39,0.08)]">
              <div className="rounded-[18px] border border-[#E6EAF2] bg-[#F8F9FC] p-5">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#3A5FCD]/10 px-3 py-1 text-xs font-semibold text-[#3A5FCD]">
                    Featured insight
                  </span>
                  <span className="text-sm font-medium text-[#1A1A1A]/45">Exclusive</span>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[#111827]">
                  Undervalued B2B workflow ideas hidden in niche service markets
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/65">
                  A premium concept with buyer-ready angles, monetization logic, and positioning opportunities.
                </p>

                <div className="mt-6 rounded-[14px] border border-dashed border-[#C8D2EA] bg-white p-4">
                  <p className="text-sm font-medium text-[#1A1A1A]/70">Teaser preview</p>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 rounded bg-[#E8ECF5]" />
                    <div className="h-2 w-11/12 rounded bg-[#E8ECF5]" />
                    <div className="h-2 w-9/12 rounded bg-[#E8ECF5]" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#E6EAF2] pt-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#1A1A1A]/40">Price</p>
                    <p className="mt-1 text-lg font-semibold text-[#111827]">$49.00</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#1A1A1A]/40">Unlocks</p>
                    <p className="mt-1 text-lg font-semibold text-[#111827]">128</p>
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

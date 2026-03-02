import Link from "next/link";
import { ArrowRight, Lock, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#F5F6FA] py-20 sm:py-32 lg:pb-40">
      {/* Subtle Professional Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.4] bg-[linear-gradient(to_right,#D9DCE3_1px,transparent_1px),linear-gradient(to_bottom,#D9DCE3_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left: Copy & Actions */}
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] sm:text-5xl xl:text-6xl">
              High-value insights, <br className="hidden lg:block" />
              <span className="text-[#3A5FCD]">locked and loaded.</span>
            </h1>

            <p className="mt-6 text-[18px] leading-[1.6] text-[#1A1A1A]/70 sm:text-[20px]">
              The exclusive marketplace for top-tier professionals. Post your hidden ideas, set your own terms, and monetize your brilliance every time a buyer unlocks it.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-[16px]">
                <Link href="/ideas">
                  Explore Marketplace
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-[16px] bg-[#FFFFFF]">
                <Link href="/sign-up">Start Selling</Link>
              </Button>
            </div>
          </div>

          {/* Right: Creative "Mystery" Visual Context */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none h-[400px] hidden md:block">
            {/* Background glowing accent (Golden Hint) */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8C26A]/20 blur-[80px]"></div>

            {/* Unlocked Document (Background) */}
            <div className="absolute right-[10%] top-[10%] w-72 rotate-[6deg] rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform hover:rotate-[4deg]">
              <div className="mb-4 flex items-center justify-between border-b border-[#D9DCE3] pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#E8C26A]/15 text-[#E8C26A]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-[#1A1A1A]">$50.00</span>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-3/4 rounded bg-[#1A1A1A]/10"></div>
                <div className="h-3 w-full rounded bg-[#1A1A1A]/10"></div>
                <div className="h-3 w-5/6 rounded bg-[#1A1A1A]/10"></div>
              </div>
            </div>

            {/* Locked Document (Foreground) */}
            <div className="absolute left-[10%] top-[25%] w-80 -rotate-[3deg] rounded-[12px] border border-[#3A5FCD]/20 bg-[#FFFFFF] p-1 shadow-[0_12px_40px_rgba(58,95,205,0.08)] backdrop-blur-sm transition-transform hover:-rotate-[1deg] z-20">
              <div className="relative flex h-48 w-full flex-col items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#D9DCE3]/50 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_1px,_#FFFFFF_1px)] bg-[size:100%_4px] opacity-50 backdrop-blur-[2px]"></div>
                <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#3A5FCD] shadow-[0_4px_12px_rgba(58,95,205,0.3)]">
                  <Lock className="h-6 w-6 text-[#FFFFFF]" />
                </div>
                <p className="z-10 mt-4 text-[14px] font-semibold tracking-wide text-[#1A1A1A]">
                  HIDDEN INSIGHT
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

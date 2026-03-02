import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-[#F5F6FA] py-24 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          {/* Subtle premium hint */}
          <div className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8C26A]/30 bg-[#E8C26A]/10 px-4 py-1.5 text-sm font-medium text-[#1A1A1A]">
              <span className="h-2 w-2 rounded-full bg-[#E8C26A]"></span>
              Premium Idea Marketplace
            </span>
          </div>

          {/* Heading: Bold but not heavy */}
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] sm:text-6xl">
            Valuable ideas,{" "}
            <span className="text-[#3A5FCD]">unlocked.</span>
          </h1>

          {/* Generous line height (1.6) and readable medium weight */}
          <p className="mt-6 text-[18px] leading-[1.6] text-[#1A1A1A]/70 sm:text-[20px]">
            Discover exclusive insights from top creators. Post your hidden ideas, 
            set your terms, and earn securely every time someone accesses your brilliance.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/ideas">
                Explore Marketplace
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/sign-up">Start Selling</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

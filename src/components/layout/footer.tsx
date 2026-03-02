import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#D9DCE3] bg-[#FFFFFF] mt-auto">
      <div className="container mx-auto px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#3A5FCD]">
                <Sparkles className="h-3 w-3 text-[#E8C26A]" />
              </div>
              <span className="text-[16px] font-bold tracking-tight text-[#1A1A1A]">
                MysteryMarket
              </span>
            </Link>
            <p className="mt-4 text-[15px] leading-[1.6] text-[#1A1A1A]/70">
              The professional marketplace for high-value hidden ideas and insights.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] font-semibold text-[#1A1A1A]">
              Platform
            </h3>
            <ul className="space-y-3">
              <li><Link href="/ideas" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">Browse</Link></li>
              <li><Link href="/creator" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">Creator Studio</Link></li>
              <li><Link href="/dashboard" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] font-semibold text-[#1A1A1A]">
              Company
            </h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">About</Link></li>
              <li><Link href="/contact" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[14px] font-semibold text-[#1A1A1A]">
              Legal
            </h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[15px] text-[#1A1A1A]/70 transition-colors hover:text-[#3A5FCD]">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-[#D9DCE3] pt-8">
          <p className="text-[14px] text-[#1A1A1A]/60">
            © {new Date().getFullYear()} MysteryMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

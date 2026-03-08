import Link from "next/link";
import { Sparkles } from "lucide-react";
import { CATEGORY_META } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[#D9DCE3] bg-[#FFFFFF] mt-auto">
      <div className="container mx-auto px-6 py-16 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 lg:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#F5F6FA] border border-[#D9DCE3] transition-colors group-hover:border-[#3A5FCD]/30 group-hover:bg-[#3A5FCD]/5">
                <Sparkles className="h-4 w-4 text-[#3A5FCD]" />
              </div>
              <span className="text-[18px] font-bold tracking-tight text-[#1A1A1A]">
                MysteryMarket
              </span>
            </Link>
            <p className="mt-5 text-[15px] leading-[1.7] text-[#1A1A1A]/70 max-w-[280px]">
              The exclusive marketplace for top-tier professionals to monetize their hidden insights and high-value strategies.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A]">
              Platform
            </h3>
            <ul className="space-y-3.5">
              <li><Link href="/ideas" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Explore Ideas</Link></li>
              <li><Link href="/creator" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Creator Studio</Link></li>
              <li><Link href="/dashboard" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">My Account</Link></li>
              <li><Link href="/dashboard/bookmarks" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Saved Ideas</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A]">
              Categories
            </h3>
            <ul className="space-y-3.5">
              {Object.values(CATEGORY_META).slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/ideas/category/${cat.slug}`} className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A]">
              Company
            </h3>
            <ul className="space-y-3.5">
              <li><Link href="/about" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">About Us</Link></li>
              <li><Link href="/blog" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Blog</Link></li>
              <li><Link href="/contact" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-[14px] font-bold uppercase tracking-wider text-[#1A1A1A]">
              Legal
            </h3>
            <ul className="space-y-3.5">
              <li><Link href="/privacy" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[15px] font-medium text-[#1A1A1A]/60 transition-colors hover:text-[#3A5FCD]">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-16 border-t border-[#D9DCE3] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[14px] text-[#1A1A1A]/50 font-medium">
            © {new Date().getFullYear()} MysteryMarket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

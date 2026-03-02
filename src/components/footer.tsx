import Link from "next/link";
import { Lightbulb } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Lightbulb className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-foreground">MysteryIdea</span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground font-medium">
              The premium marketplace for hidden ideas. Post, price, and profit from your best thinking, instantly.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Platform
            </h3>
            <ul className="space-y-4">
              <li><Link href="/ideas" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Browse Marketplace</Link></li>
              <li><Link href="/creator" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Creator Studio</Link></li>
              <li><Link href="/dashboard" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Company
            </h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">About Us</Link></li>
              <li><Link href="/blog" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Insights Blog</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Legal
            </h3>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm font-medium text-slate-500 transition-colors hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-400">
            © {new Date().getFullYear()} MysteryMarket Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

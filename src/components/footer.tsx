import Link from "next/link";
import { Lightbulb } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span className="font-bold text-foreground">MysteryIdea</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The premium marketplace for hidden ideas. Post, price, and profit
              from your best thinking.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ideas"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Browse Ideas
                </Link>
              </li>
              <li>
                <Link
                  href="/creator"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Creator Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MysteryIdea. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

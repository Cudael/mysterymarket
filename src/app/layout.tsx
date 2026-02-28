import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "MysteryIdea - Premium Idea Marketplace",
  description:
    "Discover and unlock premium ideas from creators worldwide. Post, price, and profit from your best ideas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_ZXhhbXBsZS5jb20k"}
      appearance={{ baseTheme: dark }}
    >
      <html lang="en" className="dark">
        <body
          className={`bg-gray-950 text-white antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

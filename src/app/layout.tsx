import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";
import "./globals.css";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export const metadata: Metadata = {
  title: {
    default: "MysteryIdea — Premium Idea Marketplace",
    template: "%s | MysteryIdea",
  },
  description:
    "Discover and unlock premium hidden ideas from top creators. Buy exclusive concepts or multi-unlock ideas at your own price.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://mysteryidea.com"
  ),
  openGraph: {
    title: "MysteryIdea — Premium Idea Marketplace",
    description:
      "Discover and unlock premium hidden ideas from top creators.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{ baseTheme: dark }}
    >
      <html lang="en" className="dark">
        <body
          className={`font-sans bg-gray-950 text-white antialiased`}
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

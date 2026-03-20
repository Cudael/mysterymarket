import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export const metadata: Metadata = {
  title: {
    default: "IdeaVex — Premium Idea Marketplace",
    template: "%s | IdeaVex",
  },
  description:
    "Discover and unlock premium hidden ideas from top creators. Buy exclusive concepts or multi-unlock ideas at your own price.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://ideavex.com"
  ),
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "IdeaVex — Premium Idea Marketplace",
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
    >
      <html lang="en">
        <body
          className="font-sans antialiased"
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

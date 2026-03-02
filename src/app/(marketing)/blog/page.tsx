import type { Metadata } from "next";
import { Rss } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog - MysteryIdea",
  description: "Insights, tips, and stories from the MysteryIdea community.",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Rss className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We&apos;re working on something great. Check back soon for insights,
          creator stories, and tips on making the most of MysteryIdea.
        </p>
        <p className="mt-3 text-muted-foreground">Coming soon.</p>
      </div>
    </div>
  );
}

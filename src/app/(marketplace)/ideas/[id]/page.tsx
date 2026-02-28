import type { Metadata } from "next";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Idea Details - MysteryIdea",
};

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/ideas"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Ideas
      </Link>

      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Idea Details</h1>
          <p className="mt-3 text-muted-foreground">
            Full idea detail page coming soon. This will show the teaser, price,
            creator profile, and unlock button.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Idea ID: <code className="text-primary">{id}</code>
          </p>
          <Button asChild className="mt-6">
            <Link href="/ideas">Browse More Ideas</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

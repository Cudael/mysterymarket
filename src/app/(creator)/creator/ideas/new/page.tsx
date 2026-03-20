import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Lightbulb, Sparkles } from "lucide-react";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
import { createIdea } from "@/features/ideas/actions";

export const metadata: Metadata = {
  title: "Create Idea - MysteryMarket",
};

export default async function NewIdeaPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Create New Idea"
        description="Share your insight, set your price, and publish when you're ready. Payout setup can be completed later."
        icon={<Lightbulb className="h-6 w-6 text-white" />}
      />

      <ContentCard bodyClassName="p-6 sm:p-8">
        <div className="mb-6 flex items-start gap-3 rounded-[12px] border border-border bg-muted p-4">
          <Sparkles className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-[14px] font-semibold text-foreground">
              Publishing tip
            </p>
            <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
              The best listings clearly frame what the buyer gets, who it fits, and any important caveats.
              Draft first, then publish once the trust and value signals feel obvious.
            </p>
          </div>
        </div>

        <IdeaForm onSubmit={createIdea} />
      </ContentCard>
    </div>
  );
}

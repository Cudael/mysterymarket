import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { PageHeader } from "@/components/shared/page-header";
import { createIdea } from "@/features/ideas/actions";

export const metadata: Metadata = {
  title: "Create Idea - MysteryMarket",
};

export default async function NewIdeaPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <PageHeader
        title="Create New Idea"
        description="Share your insight, set your price, and start earning — no payout setup needed upfront."
      />

      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <IdeaForm onSubmit={createIdea} />
      </div>
      
    </div>
  );
}

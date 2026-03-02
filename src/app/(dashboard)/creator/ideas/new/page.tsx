import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { createIdea } from "@/features/ideas/actions";

export const metadata: Metadata = {
  title: "Create Idea - MysteryIdea",
};

export default async function NewIdeaPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Create New Idea</h1>
      <p className="mt-2 text-muted-foreground">
        Share your hidden insight with the world — on your terms.
      </p>

      <div className="mt-8">
        <IdeaForm onSubmit={createIdea} />
      </div>
    </div>
  );
}

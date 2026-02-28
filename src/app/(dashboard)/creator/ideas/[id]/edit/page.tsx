import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { IdeaForm } from "@/components/idea-form";
import { getIdeaById, updateIdea } from "@/actions/ideas";

export const metadata: Metadata = {
  title: "Edit Idea - MysteryIdea",
};

export default async function EditIdeaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const idea = await getIdeaById(id);

  if (!idea || idea.creator.clerkId !== userId) notFound();

  async function handleUpdate(data: Parameters<typeof updateIdea>[1]) {
    "use server";
    await updateIdea(id, data);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Edit Idea</h1>
      <p className="mt-2 text-muted-foreground">
        Update your idea details.
      </p>

      <div className="mt-8">
        <IdeaForm
          initialData={{
            title: idea.title,
            teaserText: idea.teaserText ?? undefined,
            teaserImageUrl: idea.teaserImageUrl ?? undefined,
            hiddenContent: idea.hiddenContent,
            priceInCents: idea.priceInCents,
            unlockType: idea.unlockType,
            maxUnlocks: idea.maxUnlocks ?? undefined,
            category: idea.category ?? undefined,
            tags: idea.tags,
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { DeleteIdeaDialog } from "@/features/ideas/components/delete-idea-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { getIdeaById, updateIdea } from "@/features/ideas/actions";

export const metadata: Metadata = {
  title: "Edit Idea - MysteryMarket",
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
    <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <PageHeader
        title="Edit Idea"
        description="Update your insight, adjust pricing, or refine your tags."
        action={
          idea._count.purchases === 0 ? (
            <DeleteIdeaDialog ideaId={id} ideaTitle={idea.title} />
          ) : undefined
        }
      />

      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
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

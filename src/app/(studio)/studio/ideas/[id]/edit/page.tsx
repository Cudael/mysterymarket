import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Pencil, AlertCircle } from "lucide-react";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { DeleteIdeaDialog } from "@/features/ideas/components/delete-idea-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
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
    <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Edit Idea"
        description="Refine your teaser, structured preview, trust signals, pricing, and publishing setup."
        icon={<Pencil className="h-6 w-6 text-white" />}
        action={
          idea._count.purchases === 0 ? (
            <DeleteIdeaDialog ideaId={id} ideaTitle={idea.title} />
          ) : undefined
        }
      />

      {idea._count.purchases > 0 && (
        <ContentCard bodyClassName="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-400" />
            <div>
              <p className="text-[14px] font-semibold text-foreground">
                This idea already has purchases
              </p>
              <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                You can still update content and pricing rules where allowed, but
                deletion is disabled to preserve purchase history.
              </p>
            </div>
          </div>
        </ContentCard>
      )}

      <ContentCard bodyClassName="p-6 sm:p-8">
        <IdeaForm
          initialData={{
            title: idea.title,
            teaserText: idea.teaserText ?? undefined,
            teaserImageUrl: idea.teaserImageUrl ?? undefined,
            hiddenContent: idea.hiddenContent,
            originalityConfirmed: idea.originalityConfirmed,
            whatYoullGet: idea.whatYoullGet ?? undefined,
            bestFitFor: idea.bestFitFor ?? undefined,
            implementationNotes: idea.implementationNotes ?? undefined,
            priceInCents: idea.priceInCents,
            unlockType: idea.unlockType,
            maxUnlocks: idea.maxUnlocks ?? undefined,
            category: idea.category ?? undefined,
            subcategory: idea.subcategory?.slug ?? undefined,
            maturityLevel: idea.maturityLevel,
            tags: idea.tags,
          }}
          onSubmit={handleUpdate}
          submitLabel="Save Changes"
        />
      </ContentCard>
    </div>
  );
}

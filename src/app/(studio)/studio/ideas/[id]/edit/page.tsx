import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { Pencil, AlertCircle } from "lucide-react";
import { IdeaForm } from "@/features/ideas/components/idea-form";
import { DeleteIdeaDialog } from "@/features/ideas/components/delete-idea-dialog";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/shared/dashboard-card";
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
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Creator Studio", href: "/studio" },
          { label: "Edit Idea" },
        ]}
      />

      <PageHeader
        title="Edit Idea"
        description="Refine your teaser, pricing, content, and publishing setup."
        icon={<Pencil className="h-6 w-6 text-white" />}
        action={
          idea._count.purchases === 0 ? (
            <DeleteIdeaDialog ideaId={id} ideaTitle={idea.title} />
          ) : undefined
        }
      />

      {idea._count.purchases > 0 && (
        <DashboardCard bodyClassName="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-[#B8860B]" />
            <div>
              <p className="text-[14px] font-semibold text-[#1A1A1A]">
                This idea already has purchases
              </p>
              <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/60">
                You can still update content and pricing rules where allowed, but
                deletion is disabled to preserve purchase history.
              </p>
            </div>
          </div>
        </DashboardCard>
      )}

      <DashboardCard bodyClassName="p-6 sm:p-8">
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
      </DashboardCard>
    </div>
  );
}

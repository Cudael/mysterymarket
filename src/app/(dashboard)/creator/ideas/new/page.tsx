import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { IdeaForm } from "@/components/idea-form";
import { createIdea } from "@/actions/ideas";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Create Idea - MysteryIdea",
};

export default async function NewIdeaPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Create New Idea</h1>
      <p className="mt-2 text-muted-foreground">
        Share your hidden insight with the world — on your terms.
      </p>

      {!user?.stripeOnboarded && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Stripe not connected
            </p>
            <p className="text-sm text-muted-foreground">
              You need to{" "}
              <Link
                href="/creator/connect"
                className="underline hover:text-foreground"
              >
                connect Stripe
              </Link>{" "}
              before you can publish ideas.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8">
        <IdeaForm onSubmit={createIdea} />
      </div>
    </div>
  );
}

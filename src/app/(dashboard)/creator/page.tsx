import type { Metadata } from "next";
import Link from "next/link";
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteIdeaDialog } from "@/components/delete-idea-dialog";
import { getIdeasByCreator } from "@/actions/ideas";
import { getConnectAccountStatus } from "@/actions/stripe-connect";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Creator Studio - MysteryIdea",
};

export default async function CreatorPage() {
  const [ideas, connectStatus] = await Promise.all([
    getIdeasByCreator(),
    getConnectAccountStatus(),
  ]);

  const totalRevenue = ideas.reduce((sum, idea) => {
    return (
      sum +
      idea.purchases.reduce(
        (s, p) => s + p.amountInCents - p.platformFeeInCents,
        0
      )
    );
  }, 0);

  const totalSales = ideas.reduce((sum, idea) => sum + idea._count.purchases, 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Creator Studio</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your ideas and track earnings.
          </p>
        </div>
        <Button asChild>
          <Link href="/creator/ideas/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Idea
          </Link>
        </Button>
      </div>

      {/* Stripe Connect Banner */}
      {!connectStatus.connected ? (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Connect Stripe to start earning
            </p>
            <p className="text-sm text-muted-foreground">
              You need to connect a Stripe account before you can publish ideas.
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/creator/connect">Connect Stripe</Link>
          </Button>
        </div>
      ) : !connectStatus.onboarded ? (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-yellow-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Complete Stripe onboarding
            </p>
            <p className="text-sm text-muted-foreground">
              Finish setting up your Stripe account to receive payments.
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/creator/connect">Complete Setup</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
          <p className="text-sm font-medium text-foreground">
            Stripe account connected and ready to receive payments
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Ideas</span>
            <Lightbulb className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {ideas.length}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Revenue</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatPrice(totalRevenue)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {totalSales}
          </p>
        </div>
      </div>

      {/* Ideas list */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Your Ideas
        </h2>
        {ideas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
            <Lightbulb className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">
              You haven&apos;t posted any ideas yet.
            </p>
            <Button asChild className="mt-4">
              <Link href="/creator/ideas/new">Post Your First Idea</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Sales
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="bg-card">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {idea.title}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatPrice(idea.priceInCents)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {idea.unlockType === "EXCLUSIVE"
                          ? "Exclusive"
                          : "Multi"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={idea.published ? "default" : "secondary"}
                      >
                        {idea.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {idea._count.purchases}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/creator/ideas/${idea.id}/edit`}>
                            <Pencil className="h-3 w-3" />
                          </Link>
                        </Button>
                        {idea._count.purchases === 0 && (
                          <DeleteIdeaDialog ideaId={idea.id} ideaTitle={idea.title} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

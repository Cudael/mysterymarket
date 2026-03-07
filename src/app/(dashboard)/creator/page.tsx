import type { Metadata } from "next";
import Link from "next/link";
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Wallet2,
  Pencil,
  BarChart3,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteIdeaDialog } from "@/features/ideas/components/delete-idea-dialog";
import { CreatorPublishToggle } from "@/features/ideas/components/creator-publish-toggle";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { DashboardCard } from "@/components/shared/dashboard-card";
import { getIdeasByCreator } from "@/features/ideas/actions";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Creator Studio - MysteryIdea",
};

export default async function CreatorPage() {
  const [ideas, { wallet }] = await Promise.all([
    getIdeasByCreator(),
    getWalletWithTransactions(0),
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Creator Studio" },
        ]}
      />
      <PageHeader
        title="Creator Studio"
        description="Manage your ideas and track your earnings."
        icon={<Lightbulb className="h-6 w-6 text-[#FFFFFF]" />}
        action={
          <Button asChild>
            <Link href="/creator/ideas/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Idea
            </Link>
          </Button>
        }
      />

      {/* Wallet summary */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-[12px] border border-[#3A5FCD]/20 bg-[#3A5FCD]/5 p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[#FFFFFF] border border-[#3A5FCD]/20">
          <Wallet2 className="h-6 w-6 text-[#3A5FCD]" />
        </div>
        <div className="flex-1">
          <p className="text-[16px] font-medium text-[#1A1A1A]">
            Available Balance:{" "}
            <span className="text-[#3A5FCD] font-bold">
              {formatPrice(wallet.balanceInCents)}
            </span>
          </p>
          <p className="text-sm text-[#1A1A1A]/60 mt-1">
            Total earned: {formatPrice(wallet.totalEarnedInCents)}
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="bg-[#FFFFFF]">
          <Link href="/creator/wallet">Manage Wallet</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard label="Total Ideas" value={ideas.length} icon={Lightbulb} />
        <StatCard label="Net Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} />
        <StatCard label="Total Sales" value={totalSales} icon={TrendingUp} />
      </div>

      {/* Creator workspace quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/creator/analytics"
          className="group flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10">
            <BarChart3 className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">Analytics</p>
            <p className="text-[12px] text-[#1A1A1A]/50">Revenue & performance</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#1A1A1A]/30 group-hover:text-[#3A5FCD] transition-colors" />
        </Link>

        <Link
          href="/creator/connect"
          className="group flex items-center gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10">
            <CreditCard className="h-5 w-5 text-[#3A5FCD]" />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">Payouts</p>
            <p className="text-[12px] text-[#1A1A1A]/50">Payouts & account setup</p>
          </div>
          <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-[#1A1A1A]/30 group-hover:text-[#3A5FCD] transition-colors" />
        </Link>
      </div>

      {/* Ideas list */}
      <DashboardCard
        title="Your Ideas"
        bodyClassName={ideas.length === 0 ? "p-6" : "p-0"}
        action={
          ideas.length > 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/creator/ideas/new">
                <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                New Idea
              </Link>
            </Button>
          ) : undefined
        }
      >
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Lightbulb className="mx-auto h-10 w-10 text-[#D9DCE3]" />
            <p className="mt-4 text-[16px] text-[#1A1A1A]/70">
              You haven&apos;t posted any ideas yet. Start monetizing your knowledge.
            </p>
            <Button asChild className="mt-6">
              <Link href="/creator/ideas/new">Post Your First Idea</Link>
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-[#D9DCE3] bg-[#F8F9FC]">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">Title</th>
                <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">Price</th>
                <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">Sales</th>
                <th className="px-6 py-4 text-right font-semibold text-[#1A1A1A]/70">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DCE3]">
              {ideas.map((idea) => (
                <tr key={idea.id} className="transition-colors hover:bg-[#F5F6FA]">
                  <td className="px-6 py-4 font-medium text-[#1A1A1A]">{idea.title}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]/70">{formatPrice(idea.priceInCents)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-[6px] bg-[#F5F6FA] px-2.5 py-1 text-xs font-medium border border-[#D9DCE3] text-[#1A1A1A]">
                      {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-medium border ${
                      idea.published ? 'bg-[#AEE5D8]/20 text-emerald-800 border-[#AEE5D8]/40' : 'bg-[#F5F6FA] text-[#1A1A1A]/60 border-[#D9DCE3]'
                    }`}>
                      {idea.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]/70">{idea._count.purchases}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CreatorPublishToggle
                        ideaId={idea.id}
                        published={idea.published}
                      />
                      <Button asChild size="sm" variant="outline" className="h-8">
                        <Link href={`/creator/ideas/${idea.id}/edit`}>
                          <Pencil className="h-3 w-3 mr-1" /> Edit
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
        )}
      </DashboardCard>
    </div>
  );
}

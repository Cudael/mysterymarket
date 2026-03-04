import type { Metadata } from "next";
import Link from "next/link";
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Lightbulb,
  Wallet2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteIdeaDialog } from "@/features/ideas/components/delete-idea-dialog";
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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">Creator Studio</h1>
          <p className="mt-2 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
            Manage your ideas and track your earnings.
          </p>
        </div>
        <Button asChild>
          <Link href="/creator/ideas/new" className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Idea
          </Link>
        </Button>
      </div>

      {/* Wallet summary */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 rounded-[12px] border border-[#3A5FCD]/20 bg-[#3A5FCD]/5 p-5">
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
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#1A1A1A]/60">Total Ideas</span>
            <Lightbulb className="h-4 w-4 text-[#3A5FCD]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#1A1A1A]">{ideas.length}</p>
        </div>
        
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#1A1A1A]/60">Net Revenue</span>
            <DollarSign className="h-4 w-4 text-[#3A5FCD]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#1A1A1A]">{formatPrice(totalRevenue)}</p>
        </div>

        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#1A1A1A]/60">Total Sales</span>
            <TrendingUp className="h-4 w-4 text-[#3A5FCD]" />
          </div>
          <p className="mt-4 text-3xl font-bold text-[#1A1A1A]">{totalSales}</p>
        </div>
      </div>

      {/* Ideas list */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-[#1A1A1A]">Your Ideas</h2>
        
        {ideas.length === 0 ? (
          <div className="rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] p-16 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <Lightbulb className="mx-auto h-10 w-10 text-[#D9DCE3]" />
            <p className="mt-4 text-[16px] text-[#1A1A1A]/70">
              You haven&apos;t posted any ideas yet. Start monetizing your knowledge.
            </p>
            <Button asChild className="mt-6">
              <Link href="/creator/ideas/new">Post Your First Idea</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_14px_rgba(0,0,0,0.02)]">
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
          </div>
        )}
      </div>
    </div>
  );
}

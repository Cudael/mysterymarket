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
  Sparkles,
  ReceiptText,
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
  title: "Creator Studio - MysteryMarket",
};

const quickLinks = [
  {
    href: "/creator/analytics",
    title: "Analytics",
    description: "Track performance, reviews, and revenue trends.",
    icon: BarChart3,
  },
  {
    href: "/creator/wallet",
    title: "Wallet",
    description: "Review your balance, earnings, and transactions.",
    icon: Wallet2,
  },
  {
    href: "/creator/connect",
    title: "Payouts",
    description: "Connect Stripe and manage payout settings.",
    icon: CreditCard,
  },
  {
    href: "/creator/ideas/new",
    title: "New Idea",
    description: "Publish a new premium insight for buyers.",
    icon: PlusCircle,
  },
];

export default async function CreatorPage() {
  const [ideas, { wallet }] = await Promise.all([
    getIdeasByCreator(),
    getWalletWithTransactions(0),
  ]);

  const totalRevenue = ideas.reduce((sum, idea) => {
    return (
      sum +
      idea.purchases.reduce(
        (purchaseSum, purchase) =>
          purchaseSum + purchase.amountInCents - purchase.platformFeeInCents,
        0
      )
    );
  }, 0);

  const totalSales = ideas.reduce((sum, idea) => sum + idea._count.purchases, 0);
  const publishedIdeas = ideas.filter((idea) => idea.published).length;
  const draftIdeas = ideas.length - publishedIdeas;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Creator" },
        ]}
      />

      <PageHeader
        title="Creator Studio"
        description="Manage your ideas, monitor performance, and keep your earnings organized."
        icon={<Lightbulb className="h-6 w-6 text-white" />}
        action={
          <Button asChild>
            <Link href="/creator/ideas/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Idea
            </Link>
          </Button>
        }
      />

      <DashboardCard bodyClassName="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#3A5FCD]/10">
              <Sparkles className="h-6 w-6 text-[#3A5FCD]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-[20px] font-semibold text-[#1A1A1A]">
                Your creator workspace
              </h2>
              <p className="max-w-2xl text-[14px] leading-6 text-[#1A1A1A]/60">
                Use this space to publish ideas, review sales activity, and keep
                your payout setup in good standing. Your wallet balance updates as
                purchases are completed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]/45">
                Available Balance
              </p>
              <p className="mt-1 text-[22px] font-bold text-[#3A5FCD]">
                {formatPrice(wallet.balanceInCents)}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#1A1A1A]/45">
                Lifetime Earned
              </p>
              <p className="mt-1 text-[22px] font-bold text-[#1A1A1A]">
                {formatPrice(wallet.totalEarnedInCents)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#D9DCE3] pt-6 sm:flex-row">
          <Button asChild className="sm:w-auto">
            <Link href="/creator/ideas/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Publish New Idea
            </Link>
          </Button>

          <Button asChild variant="outline" className="sm:w-auto">
            <Link href="/creator/wallet" className="gap-2">
              <ReceiptText className="h-4 w-4" />
              View Wallet
            </Link>
          </Button>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Ideas" value={ideas.length} subLabel="All ideas created" icon={Lightbulb} />
        <StatCard label="Published" value={publishedIdeas} subLabel="Currently live" icon={Sparkles} />
        <StatCard label="Net Revenue" value={formatPrice(totalRevenue)} subLabel="After platform fees" icon={DollarSign} />
        <StatCard label="Total Sales" value={totalSales} subLabel="Completed purchases" icon={TrendingUp} />
      </div>

      <DashboardCard title="Quick Actions" bodyClassName="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 transition-all hover:border-[#3A5FCD]/35 hover:bg-[#F8F9FC] hover:shadow-[0_6px_20px_rgba(58,95,205,0.08)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD]/10">
                  <Icon className="h-5 w-5 text-[#3A5FCD]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-[#1A1A1A] transition-colors group-hover:text-[#3A5FCD]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-[#1A1A1A]/55">
                    {item.description}
                  </p>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#1A1A1A]/30 transition-colors group-hover:text-[#3A5FCD]" />
              </Link>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardCard
        title="Your Ideas"
        bodyClassName={ideas.length === 0 ? "p-6" : "p-0"}
        action={
          ideas.length > 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/creator/ideas/new" className="gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                New Idea
              </Link>
            </Button>
          ) : undefined
        }
      >
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F6FA]">
              <Lightbulb className="h-7 w-7 text-[#3A5FCD]" />
            </div>
            <p className="mt-5 text-[18px] font-semibold text-[#1A1A1A]">
              No ideas published yet
            </p>
            <p className="mt-2 max-w-lg text-[14px] leading-6 text-[#1A1A1A]/60">
              Start with one strong idea. Add a clear teaser, set a fair price,
              and publish when you’re ready. You can always edit drafts later.
            </p>
            <Button asChild className="mt-6">
              <Link href="/creator/ideas/new">Create Your First Idea</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-[#D9DCE3] bg-[#F8F9FC]">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                      Sales
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-[#1A1A1A]/70">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D9DCE3]">
                  {ideas.map((idea) => (
                    <tr key={idea.id} className="transition-colors hover:bg-[#F8F9FC]">
                      <td className="px-6 py-4 font-medium text-[#1A1A1A]">
                        {idea.title}
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A]/70">
                        {formatPrice(idea.priceInCents)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-[999px] border border-[#D9DCE3] bg-[#F5F6FA] px-2.5 py-1 text-xs font-medium text-[#1A1A1A]">
                          {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-use"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-[999px] px-2.5 py-1 text-xs font-medium border ${
                            idea.published
                              ? "border-[#AEE5D8]/50 bg-[#AEE5D8]/20 text-emerald-800"
                              : "border-[#D9DCE3] bg-[#F5F6FA] text-[#1A1A1A]/60"
                          }`}
                        >
                          {idea.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#1A1A1A]/70">
                        {idea._count.purchases}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <CreatorPublishToggle
                            ideaId={idea.id}
                            published={idea.published}
                          />
                          <Button asChild size="sm" variant="outline" className="h-8">
                            <Link href={`/creator/ideas/${idea.id}/edit`}>
                              <Pencil className="mr-1 h-3 w-3" />
                              Edit
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

            <div className="space-y-4 p-4 md:hidden">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-[#1A1A1A]">
                        {idea.title}
                      </p>
                      <p className="mt-1 text-[13px] text-[#1A1A1A]/55">
                        {formatPrice(idea.priceInCents)} • {idea._count.purchases} sales
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-[999px] px-2.5 py-1 text-xs font-medium border ${
                        idea.published
                          ? "border-[#AEE5D8]/50 bg-[#AEE5D8]/20 text-emerald-800"
                          : "border-[#D9DCE3] bg-[#F5F6FA] text-[#1A1A1A]/60"
                      }`}
                    >
                      {idea.published ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-[999px] border border-[#D9DCE3] bg-[#F5F6FA] px-2.5 py-1 text-xs font-medium text-[#1A1A1A]">
                      {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-use"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <CreatorPublishToggle
                      ideaId={idea.id}
                      published={idea.published}
                    />
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <Link href={`/creator/ideas/${idea.id}/edit`}>
                        <Pencil className="mr-1 h-3 w-3" />
                        Edit
                      </Link>
                    </Button>
                    {idea._count.purchases === 0 && (
                      <DeleteIdeaDialog ideaId={idea.id} ideaTitle={idea.title} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </DashboardCard>

      {draftIdeas > 0 && (
        <DashboardCard title="Publishing Tip" bodyClassName="p-6">
          <p className="text-[14px] leading-6 text-[#1A1A1A]/65">
            You currently have <span className="font-semibold text-[#1A1A1A]">{draftIdeas}</span>{" "}
            draft {draftIdeas === 1 ? "idea" : "ideas"}. If an idea is ready,
            publishing it can improve visibility and sales momentum.
          </p>
        </DashboardCard>
      )}
    </div>
  );
}

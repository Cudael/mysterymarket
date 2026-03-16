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
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteIdeaDialog } from "@/features/ideas/components/delete-idea-dialog";
import { CreatorPublishToggle } from "@/features/ideas/components/creator-publish-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ContentCard } from "@/components/shared/content-card";
import { getIdeasByCreator } from "@/features/ideas/actions";
import { getWalletWithTransactions } from "@/features/wallet/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Creator Studio - MysteryMarket",
};

const quickLinks = [
  {
    href: "/studio/analytics",
    title: "Analytics",
    description: "Track performance, reviews, and revenue trends.",
    icon: BarChart3,
  },
  {
    href: "/studio/wallet",
    title: "Wallet",
    description: "Review your balance, earnings, and transactions.",
    icon: Wallet2,
  },
  {
    href: "/studio/payouts",
    title: "Payouts",
    description: "Connect Stripe and manage payout settings.",
    icon: CreditCard,
  },
  {
    href: "/studio/ideas/new",
    title: "New Idea",
    description: "Publish a new premium insight for buyers.",
    icon: PlusCircle,
  },
];

export default async function StudioPage() {
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

  const motivationalMessage =
    totalSales === 0
      ? "Your studio is ready. Publish your first idea to start earning."
      : totalSales < 10
        ? `You've made ${totalSales} ${totalSales === 1 ? "sale" : "sales"}. Keep publishing to grow your audience.`
        : `${totalSales} sales and counting — your ideas are resonating with buyers.`;

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Creator Studio"
        description="Manage your ideas, monitor performance, and keep your earnings organized."
        icon={<Lightbulb className="h-6 w-6 text-white" />}
        action={
          <Button asChild>
            <Link href="/studio/ideas/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              New Idea
            </Link>
          </Button>
        }
      />

      {/* Hero card */}
      <ContentCard bodyClassName="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-[20px] font-semibold text-foreground">
                Your creative workspace
              </h2>
              <p className="max-w-2xl text-[14px] leading-6 text-muted-foreground">
                {motivationalMessage}
              </p>
              {draftIdeas > 0 && (
                <div className="flex items-center gap-2 rounded-[8px] border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <p className="text-[13px] text-amber-300">
                    {draftIdeas} draft {draftIdeas === 1 ? "idea" : "ideas"} ready to publish
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] border border-border bg-muted px-4 py-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Available Balance
              </p>
              <p className="mt-1 text-[22px] font-bold text-primary">
                {formatPrice(wallet.balanceInCents)}
              </p>
            </div>
            <div className="rounded-[12px] border border-border bg-muted px-4 py-3">
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                Lifetime Earned
              </p>
              <p className="mt-1 text-[22px] font-bold text-foreground">
                {formatPrice(wallet.totalEarnedInCents)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
          <Button asChild className="sm:w-auto">
            <Link href="/studio/ideas/new" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Publish New Idea
            </Link>
          </Button>

          <Button asChild variant="outline" className="sm:w-auto">
            <Link href="/studio/wallet" className="gap-2">
              <ReceiptText className="h-4 w-4" />
              View Wallet
            </Link>
          </Button>

          {ideas.length > 0 && (
            <Button asChild variant="outline" className="sm:w-auto">
              <Link href="/studio/analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          )}
        </div>
      </ContentCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Ideas" value={ideas.length} subLabel="All ideas created" icon={Lightbulb} />
        <StatCard label="Published" value={publishedIdeas} subLabel="Currently live" icon={Sparkles} />
        <StatCard label="Net Revenue" value={formatPrice(totalRevenue)} subLabel="After platform fees" icon={DollarSign} />
        <StatCard label="Total Sales" value={totalSales} subLabel="Completed purchases" icon={TrendingUp} />
      </div>

      <ContentCard title="Quick Actions" bodyClassName="p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {quickLinks.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-4 rounded-[12px] border border-border bg-card p-5 transition-all hover:border-primary/35 hover:bg-muted hover:shadow-[var(--shadow-primary-glow)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-5 text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/30 transition-colors group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </ContentCard>

      <ContentCard
        title="Your Ideas"
        bodyClassName={ideas.length === 0 ? "p-6" : "p-0"}
        action={
          ideas.length > 0 ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/studio/ideas/new" className="gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                New Idea
              </Link>
            </Button>
          ) : undefined
        }
      >
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Lightbulb className="h-7 w-7 text-primary" />
            </div>
            <p className="mt-5 text-[18px] font-semibold text-foreground">
              No ideas published yet
            </p>
            <p className="mt-2 max-w-lg text-[14px] leading-6 text-muted-foreground">
              Start with one strong idea. Add a clear teaser, set a fair price,
              and publish when you&apos;re ready. You can always edit drafts later.
            </p>
            <Button asChild className="mt-6">
              <Link href="/studio/ideas/new">Create Your First Idea</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-foreground/70">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground/70">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground/70">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground/70">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-foreground/70">
                      Sales
                    </th>
                    <th className="px-6 py-4 text-right font-semibold text-foreground/70">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {ideas.map((idea) => (
                    <tr key={idea.id} className="transition-colors hover:bg-muted">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {idea.title}
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {formatPrice(idea.priceInCents)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-[999px] border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                          {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-use"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={idea.published ? "default" : "secondary"}
                          className={
                            idea.published
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                              : ""
                          }
                        >
                          {idea.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">
                        {idea._count.purchases}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <CreatorPublishToggle
                            ideaId={idea.id}
                            published={idea.published}
                          />
                          <Button asChild size="sm" variant="outline" className="h-8">
                            <Link href={`/studio/ideas/${idea.id}/edit`}>
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
                  className="rounded-[12px] border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-foreground">
                        {idea.title}
                      </p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {formatPrice(idea.priceInCents)} · {idea._count.purchases} sales
                      </p>
                    </div>

                    <Badge
                      variant={idea.published ? "default" : "secondary"}
                      className={
                        idea.published
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : ""
                      }
                    >
                      {idea.published ? "Published" : "Draft"}
                    </Badge>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-[999px] border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                      {idea.unlockType === "EXCLUSIVE" ? "Exclusive" : "Multi-use"}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <CreatorPublishToggle
                      ideaId={idea.id}
                      published={idea.published}
                    />
                    <Button asChild size="sm" variant="outline" className="h-8">
                      <Link href={`/studio/ideas/${idea.id}/edit`}>
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
      </ContentCard>
    </div>
  );
}

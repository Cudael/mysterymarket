import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code,
  Bot,
  Lock,
  Palette,
  Rocket,
  Sparkles,
  Wallet,
  Search,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const CATEGORIES = [
  {
    icon: Rocket,
    name: "Startup Ideas",
    desc: "Business models, operator playbooks, and launch-ready opportunities.",
    slug: "startup-business-ideas",
  },
  {
    icon: Bot,
    name: "AI & Automation",
    desc: "Workflow systems, prompt stacks, and automation concepts.",
    slug: "ai-automation",
  },
  {
    icon: Code,
    name: "Software & Tech",
    desc: "Developer tools, SaaS angles, and technical strategy.",
    slug: "software-technology",
  },
  {
    icon: Palette,
    name: "Design & Creative",
    desc: "Creative direction, visual systems, and design-led ideas.",
    slug: "design-visual-arts",
  },
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Search,
    title: "Discover Hidden Teasers",
    description:
      "Every listing shows just enough to spark curiosity. Browse by category, price, or topic — without seeing the full idea first.",
  },
  {
    step: "02",
    icon: Lock,
    title: "Unlock What Calls to You",
    description:
      "Pay once to reveal the full idea instantly. No subscriptions, no guesswork — just direct access to what you want.",
  },
  {
    step: "03",
    icon: Wallet,
    title: "Yours Forever, Theirs Earned",
    description:
      "You keep permanent access. Creators earn for their thinking. Everyone wins when good ideas find the right people.",
  },
] as const;

const BUYER_POINTS = [
  "Know what you're paying for before you commit",
  "Browse by category, price, or what's trending",
  "Unlock once — access yours forever",
] as const;

const CREATOR_POINTS = [
  "Monetize your best thinking without giving it all away",
  "Set pricing that reflects the true value of your ideas",
  "Reach buyers in a marketplace built for discovery",
] as const;

const FAQS = [
  {
    question: "What happens after I unlock an idea?",
    answer:
      "You get access to the full listing content immediately. MysteryMarket is designed around direct unlocks rather than ongoing subscription access.",
  },
  {
    question: "Is this a subscription marketplace?",
    answer:
      "No. The core model is pay for the ideas you want. That keeps discovery cleaner for buyers and pricing clearer for creators.",
  },
  {
    question: "Can creators choose their own pricing?",
    answer:
      "Yes. Creators decide how to package and price their ideas so the value can match the depth, scarcity, or commercial usefulness of the insight.",
  },
  {
    question: "Are ideas exclusive?",
    answer:
      "Listings can be structured around different access models. The marketplace is built to support premium, paid idea distribution instead of generic public posting.",
  },
] as const;

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${
            dark ? "text-white/50" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[30px] font-bold tracking-[-0.03em] sm:text-[40px] ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[17px] leading-8 ${
            dark ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function IconBadge({
  icon: Icon,
}: {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-current/15 text-current">
      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
    </div>
  );
}

function ProofStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-gold">
        {value}
      </p>
    </div>
  );
}

function HeroPreviewCard({
  title,
  category,
  price,
  muted,
}: {
  title: string;
  category: string;
  price: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] border p-5 backdrop-blur-sm transition-all ${
        muted
          ? "border-white/8 bg-white/[0.04]"
          : "border-white/15 bg-white/[0.07] shadow-[0_0_30px_rgba(139,92,246,0.10),0_18px_60px_rgba(0,0,0,0.28)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
          {category}
        </span>
        <span className="text-sm font-semibold text-gold">{price}</span>
      </div>
      <h3 className="mt-4 text-[17px] font-semibold leading-7 text-white">
        {title}
      </h3>
      <div className="mt-3 space-y-1.5">
        <div className="h-2 w-[85%] rounded-full bg-white/10 blur-[2px]" />
        <div className="h-2 w-[70%] rounded-full bg-white/[0.07] blur-[2px]" />
        <div className="h-2 w-[55%] rounded-full bg-white/[0.05] blur-[2px]" />
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/35">
        <Lock className="h-3 w-3" />
        <span>Full idea hidden until unlocked</span>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const { userId: clerkId } = await auth();

  const [featuredIdeas, bookmarkedIdeaIds, totalIdeas, totalPurchases, totalCreators] =
    await Promise.all([
      prisma.idea.findMany({
        where: { published: true },
        include: {
          creator: { select: { id: true, name: true, avatarUrl: true } },
          _count: { select: { purchases: true } },
        },
        orderBy: { purchases: { _count: "desc" } },
        take: 3,
      }),
      clerkId
        ? prisma.bookmark
            .findMany({
              where: { user: { clerkId } },
              select: { ideaId: true },
            })
            .then((bs) => new Set(bs.map((b) => b.ideaId)))
        : Promise.resolve(new Set<string>()),
      prisma.idea.count({ where: { published: true } }),
      prisma.purchase.count({ where: { status: "COMPLETED" } }),
      prisma.user.count({ where: { role: "CREATOR" } }),
    ]);

  return (
    <div className="bg-background text-foreground">
      <section className="relative overflow-hidden bg-[hsl(252,40%,6%)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(109,90,230,0.22),transparent_40%),radial-gradient(ellipse_at_85%_15%,rgba(232,194,106,0.08),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(109,90,230,0.08),transparent_60%)]" />

        <div className="container relative mx-auto max-w-[1400px] px-6 pb-20 pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/72 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-gold" />
                Ideas worth keeping secret
              </div>

              <h1 className="mt-7 text-[44px] font-bold tracking-[-0.05em] text-white sm:text-[60px] sm:leading-[1.02] lg:text-[72px]">
                The best ideas aren&apos;t free.
              </h1>

              <p className="mt-6 max-w-xl text-[18px] leading-[1.7] text-white/70 sm:text-[20px]">
                Browse what creators won&apos;t share publicly. Unlock the ideas
                worth paying for.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-[12px] bg-gold px-7 font-semibold text-gold-foreground shadow-[var(--shadow-gold-glow)] hover:bg-gold/90"
                >
                  <Link href="/ideas">
                    Start exploring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-[12px] border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/sign-up">Sell your ideas</Link>
                </Button>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <ProofStat
                  label="Published ideas"
                  value={totalIdeas.toLocaleString()}
                />
                <ProofStat
                  label="Successful unlocks"
                  value={totalPurchases.toLocaleString()}
                />
                <ProofStat
                  label="Active creators"
                  value={totalCreators.toLocaleString()}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-8 h-36 w-36 rounded-full bg-primary/8 blur-3xl" />
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-gold/6 blur-3xl" />

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-5">
                <div className="rounded-[26px] border border-white/10 bg-[hsl(252,35%,8%)] p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                        Live marketplace
                      </p>
                      <p className="mt-1.5 text-sm text-white/55">
                        Real ideas. Real prices. Locked until purchased.
                      </p>
                    </div>
                    <div className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs text-gold/80">
                      Live
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <HeroPreviewCard
                      category="AI & Automation"
                      title="A workflow agencies can sell to local businesses in under 14 days"
                      price="$49"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <HeroPreviewCard
                        category="Startup Ideas"
                        title="A niche marketplace model with built-in repeat demand"
                        price="$79"
                        muted
                      />
                      <HeroPreviewCard
                        category="Design & Creative"
                        title="A productized visual system offer for small B2B teams"
                        price="$39"
                        muted
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,hsl(252,40%,6%))]" />
        </div>
      </section>

      <section className="bg-background py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="Three steps to your next great idea"
            description="Browse, discover, unlock. Each step is designed to respect your curiosity and reward your investment."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-border bg-surface p-7 shadow-[0_8px_28px_rgba(15,23,42,0.03)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-foreground">
                      <IconBadge icon={Icon} />
                    </div>
                    <span className="text-[28px] font-bold tracking-tight text-gold/25">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-6 text-[22px] font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Curated picks
              </p>
              <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-foreground sm:text-[40px]">
                Ideas people are already unlocking
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-muted-foreground">
                Real listings from real creators. Browse a few to get a feel
                for what&apos;s on offer.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-[12px] border-border bg-background"
            >
              <Link href="/ideas">
                Browse all ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredIdeas.length === 0 ? (
            <div className="mt-10 rounded-[24px] border border-dashed border-border bg-background p-12 text-center text-muted-foreground">
              <p>New ideas are being curated. Check back soon.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  id={idea.id}
                  title={idea.title}
                  teaserText={idea.teaserText}
                  teaserImageUrl={idea.teaserImageUrl}
                  priceInCents={idea.priceInCents}
                  unlockType={idea.unlockType}
                  category={idea.category}
                  creatorId={idea.creator.id}
                  creatorName={idea.creator.name}
                  creatorAvatarUrl={idea.creator.avatarUrl}
                  purchaseCount={idea._count.purchases}
                  initialBookmarked={bookmarkedIdeaIds.has(idea.id)}
                  isAuthenticated={!!clerkId}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-background py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[30px] border border-white/10 bg-[hsl(252,35%,10%)] p-8 text-white shadow-[0_24px_70px_rgba(90,70,200,0.18)] sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="For buyers"
                title="Stop guessing. Start discovering."
                description="Browse curated ideas with real context. You see what you're paying for before you pay — then unlock and keep access forever."
                align="left"
                dark
              />

              <div className="mt-8 space-y-4">
                {BUYER_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 text-gold">
                      <IconBadge icon={CheckCircle2} />
                    </div>
                    <p className="text-[15px] leading-7 text-white/72">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  asChild
                  className="rounded-[12px] bg-gold font-semibold text-gold-foreground hover:bg-gold/90"
                >
                  <Link href="/ideas">Explore the marketplace</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[30px] border border-border bg-surface p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="For creators"
                title="Your expertise deserves a real price tag"
                description="Package what you know, set your own price, and let the marketplace bring buyers to you — without giving everything away for free."
                align="left"
              />

              <div className="mt-8 space-y-4">
                {CREATOR_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 text-primary">
                      <IconBadge icon={CheckCircle2} />
                    </div>
                    <p className="text-[15px] leading-7 text-muted-foreground">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="rounded-[12px] bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link href="/sign-up">Sell your ideas</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-[12px] border-border bg-background"
                >
                  <Link href="/ideas">See live listings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[30px] border border-border bg-background p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="Explore by category"
                title="Find ideas in the domains you know best"
                description="Browse by topic and discover what creators are packaging in the spaces you care about."
                align="left"
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/ideas/category/${category.slug}`}
                      className="group rounded-[22px] border border-border bg-surface p-5 transition-all hover:-translate-y-[1px] hover:border-gold/30 hover:bg-background hover:shadow-[0_4px_20px_rgba(232,194,106,0.10)]"
                    >
                      <div className="text-primary transition-colors group-hover:text-gold">
                        <IconBadge icon={Icon} />
                      </div>
                      <h3 className="mt-5 text-base font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {category.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-border bg-background p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="Common questions"
                title="Everything you need to know before your first unlock"
                description="Simple answers to the questions new visitors usually have."
                align="left"
              />

              <div className="mt-10 space-y-4">
                {FAQS.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[22px] border border-border bg-surface p-6"
                  >
                    <h3 className="text-[18px] font-semibold text-foreground">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-muted-foreground">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto max-w-[1100px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-[hsl(252,35%,10%)] px-8 py-14 text-center text-white shadow-[0_24px_80px_rgba(90,70,200,0.20)] sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,194,106,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(109,90,230,0.12),transparent_50%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                Ready to explore
              </p>
              <h2 className="mt-4 text-[34px] font-bold tracking-[-0.03em] text-white sm:text-[46px]">
                Your next great idea is already here.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[17px] leading-8 text-white/65">
                Browse the marketplace, unlock what intrigues you, or start
                selling your own expertise.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-[12px] bg-gold px-7 font-semibold text-gold-foreground shadow-[var(--shadow-gold-glow)] hover:bg-gold/90"
                >
                  <Link href="/ideas">Explore ideas</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-[12px] border-white/15 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/sign-up">Become a creator</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

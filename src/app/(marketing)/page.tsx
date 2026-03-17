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
  Eye,
  Star,
  Zap,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = [
  {
    icon: Rocket,
    name: "Startup Ideas",
    desc: "Business models, operator playbooks, and launch-ready opportunities.",
    slug: "startup-business-ideas",
    color: "text-amber-400",
    glow: "hover:shadow-[0_4px_24px_rgba(251,191,36,0.15)]",
  },
  {
    icon: Bot,
    name: "AI & Automation",
    desc: "Workflow systems, prompt stacks, and automation concepts.",
    slug: "ai-automation",
    color: "text-violet-400",
    glow: "hover:shadow-[0_4px_24px_rgba(167,139,250,0.15)]",
  },
  {
    icon: Code,
    name: "Software & Tech",
    desc: "Developer tools, SaaS angles, and technical strategy.",
    slug: "software-technology",
    color: "text-cyan-400",
    glow: "hover:shadow-[0_4px_24px_rgba(34,211,238,0.15)]",
  },
  {
    icon: Palette,
    name: "Design & Creative",
    desc: "Creative direction, visual systems, and design-led ideas.",
    slug: "design-visual-arts",
    color: "text-rose-400",
    glow: "hover:shadow-[0_4px_24px_rgba(251,113,133,0.15)]",
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
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"
      }
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold/70">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[40px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[17px] leading-8 text-white/55">
          {description}
        </p>
      )}
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
    <div className="relative overflow-hidden rounded-[20px] border border-white/8 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(232,194,106,0.06),transparent_70%)]" />
      <p className="relative text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
        {label}
      </p>
      <p className="relative mt-2 text-2xl font-bold tracking-tight text-gold">
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
  href,
}: {
  title: string;
  category: string;
  price: string;
  muted?: boolean;
  href?: string;
}) {
  const card = (
    <div
      className={`group rounded-[24px] border p-5 backdrop-blur-sm transition-all duration-300 ${
        muted
          ? "border-white/[0.07] bg-white/[0.03]"
          : "border-white/12 bg-white/[0.06] shadow-[0_0_40px_rgba(139,92,246,0.12),0_20px_60px_rgba(0,0,0,0.35)] hover:border-white/18 hover:shadow-[0_0_60px_rgba(139,92,246,0.18),0_20px_80px_rgba(0,0,0,0.40)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
          {category}
        </span>
        <span className="text-sm font-bold text-gold">{price}</span>
      </div>
      <h3 className="mt-4 text-[17px] font-semibold leading-7 text-white/90">
        {title}
      </h3>
      <div className="mt-3 space-y-2">
        <div className="h-[6px] w-[82%] rounded-full bg-white/[0.09]" />
        <div className="h-[6px] w-[67%] rounded-full bg-white/[0.06]" />
        <div className="h-[6px] w-[50%] rounded-full bg-white/[0.04]" />
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-white/30">
        <Lock className="h-3 w-3" />
        <span>Full idea hidden until unlocked</span>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} aria-label={`View idea: ${title}`}>{card}</Link>;
  }
  return card;
}

export default async function HomePage() {
  const { userId: clerkId } = await auth();

  const [featuredIdeas, bookmarkedIdeaIds, totalIdeas, totalPurchases, totalCreators, heroPreviewIdeas] =
    await Promise.all([
      prisma.idea.findMany({
        where: { published: true },
        include: {
          creator: { select: { id: true, name: true, avatarUrl: true, stripeOnboarded: true } },
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
      prisma.idea.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          category: true,
          priceInCents: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  return (
    <div className="bg-background text-foreground">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[hsl(252,32%,4%)] text-white">
        {/* Atmospheric background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_-10%_20%,rgba(109,90,230,0.28),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_10%,rgba(232,194,106,0.10),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(109,90,230,0.10),transparent_60%)]" />
        {/* Subtle dot-grid pattern */}
        <div className="absolute inset-0 dot-grid-md" />

        <div className="container relative mx-auto max-w-[1400px] px-6 pb-24 pt-24 lg:px-8 lg:pb-32 lg:pt-32">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/20 bg-gold/8 px-4 py-2 text-sm font-medium text-gold/85 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Ideas worth keeping secret
              </div>

              <h1 className="mt-8 text-[46px] font-extrabold tracking-[-0.055em] text-white sm:text-[64px] sm:leading-[1.01] lg:text-[76px]">
                The best ideas<br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                  {" "}aren&apos;t free.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-[18px] leading-[1.75] text-white/60 sm:text-[20px]">
                Browse what creators won&apos;t share publicly. Unlock the ideas
                worth paying for.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-[12px] bg-gold px-8 font-semibold text-gold-foreground shadow-[var(--shadow-gold-glow)] hover:bg-gold/90 hover:shadow-[0_6px_28px_rgba(232,194,106,0.45)] transition-all duration-300"
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
                  className="h-12 rounded-[12px] border-white/12 bg-white/[0.04] px-8 text-white hover:bg-white/[0.08] hover:text-white hover:border-white/18 transition-all duration-300"
                >
                  <Link href="/sign-up">Sell your ideas</Link>
                </Button>
              </div>

              <div className="mt-14 grid gap-4 sm:grid-cols-3">
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

            {/* Hero preview card */}
            <div className="relative">
              <div className="absolute -left-8 top-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute right-2 top-0 h-56 w-56 rounded-full bg-gold/6 blur-3xl" />
              <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/8 blur-2xl" />

              <div className="relative rounded-[32px] border border-white/10 bg-white/[0.03] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-5">
                <div className="rounded-[28px] border border-white/8 bg-[hsl(252,30%,7%)] p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/35">
                        Live marketplace
                      </p>
                      <p className="mt-1.5 text-sm text-white/50">
                        Real ideas. Real prices. Locked until purchased.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-gold/25 bg-gold/8 px-3 py-1 text-xs font-medium text-gold/75">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold/80" />
                      Live
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {heroPreviewIdeas[0] && (
                      <HeroPreviewCard
                        category={heroPreviewIdeas[0].category ?? ""}
                        title={heroPreviewIdeas[0].title}
                        price={formatPrice(heroPreviewIdeas[0].priceInCents)}
                        href={`/ideas/${heroPreviewIdeas[0].id}`}
                      />
                    )}
                    {(heroPreviewIdeas[1] || heroPreviewIdeas[2]) && (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {heroPreviewIdeas[1] && (
                          <HeroPreviewCard
                            category={heroPreviewIdeas[1].category ?? ""}
                            title={heroPreviewIdeas[1].title}
                            price={formatPrice(heroPreviewIdeas[1].priceInCents)}
                            href={`/ideas/${heroPreviewIdeas[1].id}`}
                            muted
                          />
                        )}
                        {heroPreviewIdeas[2] && (
                          <HeroPreviewCard
                            category={heroPreviewIdeas[2].category ?? ""}
                            title={heroPreviewIdeas[2].title}
                            price={formatPrice(heroPreviewIdeas[2].priceInCents)}
                            href={`/ideas/${heroPreviewIdeas[2].id}`}
                            muted
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(109,90,230,0.08),transparent_70%)]" />

        <div className="container relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="Three steps to your next great idea"
            description="Browse, discover, unlock. Each step is designed to respect your curiosity and reward your investment."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[28px] border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/12 hover:bg-white/[0.05] hover:shadow-[0_8px_40px_rgba(109,90,230,0.12)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(109,90,230,0.07),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="text-primary/80">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/8">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                      </div>
                      <span className="font-mono text-[32px] font-bold tracking-tight text-white/8 group-hover:text-gold/20 transition-colors duration-300">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="mt-7 text-[21px] font-bold tracking-tight text-white/90">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.8] text-white/50">
                      {item.description}
                    </p>
                  </div>
                  {/* Bottom accent line */}
                  <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary/60 to-gold/40 transition-all duration-500 group-hover:w-full`} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FEATURED IDEAS ───────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(109,90,230,0.06),transparent_60%)]" />

        <div className="container relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold/70">
                Curated picks
              </p>
              <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-white sm:text-[40px]">
                Ideas people are already unlocking
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-white/50">
                Real listings from real creators. Browse a few to get a feel
                for what&apos;s on offer.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-[12px] border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.07] hover:text-white hover:border-white/15"
            >
              <Link href="/ideas">
                Browse all ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredIdeas.length === 0 ? (
            <div className="mt-12 rounded-[24px] border border-white/8 border-dashed bg-white/[0.02] p-14 text-center text-white/35">
              <Eye className="mx-auto mb-4 h-8 w-8 opacity-40" />
              <p>New ideas are being curated. Check back soon.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
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
                  isCreatorVerified={idea.creator.stripeOnboarded}
                  purchaseCount={idea._count.purchases}
                  initialBookmarked={bookmarkedIdeaIds.has(idea.id)}
                  isAuthenticated={!!clerkId}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── BUYER / CREATOR SPLIT ────────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_0%_50%,rgba(232,194,106,0.05),transparent_55%),radial-gradient(ellipse_50%_60%_at_100%_50%,rgba(109,90,230,0.07),transparent_55%)]" />

        <div className="container relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            {/* Buyers card — gold accented */}
            <div className="relative overflow-hidden rounded-[32px] border border-gold/12 bg-[hsl(252,30%,7%)] p-8 shadow-[0_24px_80px_rgba(232,194,106,0.10)] sm:p-10 lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(232,194,106,0.08),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <div className="relative">
                <SectionHeader
                  eyebrow="For buyers"
                  title="Stop guessing. Start discovering."
                  description="Browse curated ideas with real context. You see what you're paying for before you pay — then unlock and keep access forever."
                  align="left"
                />

                <div className="mt-8 space-y-4">
                  {BUYER_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[15px] leading-7 text-white/65">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Button
                    asChild
                    className="rounded-[12px] bg-gold font-semibold text-gold-foreground hover:bg-gold/90 shadow-[var(--shadow-gold-glow)]"
                  >
                    <Link href="/ideas">Explore the marketplace</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Creators card — purple accented */}
            <div className="relative overflow-hidden rounded-[32px] border border-primary/15 bg-[hsl(252,30%,7%)] p-8 sm:p-10 lg:p-12">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(109,90,230,0.10),transparent_55%)]" />
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="relative">
                <SectionHeader
                  eyebrow="For creators"
                  title="Your expertise deserves a real price tag"
                  description="Package what you know, set your own price, and let the marketplace bring buyers to you — without giving everything away for free."
                  align="left"
                />

                <div className="mt-8 space-y-4">
                  {CREATOR_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[15px] leading-7 text-white/65">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    className="rounded-[12px] bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-primary-glow)]"
                  >
                    <Link href="/sign-up">Sell your ideas</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-[12px] border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.07] hover:text-white"
                  >
                    <Link href="/ideas">See live listings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES + FAQ ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-surface py-28 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_100%_50%,rgba(109,90,230,0.06),transparent_60%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

        <div className="container relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
            {/* Categories */}
            <div className="rounded-[32px] border border-white/8 bg-white/[0.025] p-8 backdrop-blur-sm sm:p-10 lg:p-12">
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
                      className={`group relative overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-[2px] hover:border-white/12 hover:bg-white/[0.06] ${category.glow}`}
                    >
                      <div className={`${category.color} transition-transform duration-300 group-hover:scale-110`}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-current/10">
                          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                        </div>
                      </div>
                      <h3 className="mt-5 text-[15px] font-semibold text-white/85">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-white/45">
                        {category.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* FAQ */}
            <div className="rounded-[32px] border border-white/8 bg-white/[0.025] p-8 backdrop-blur-sm sm:p-10 lg:p-12">
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
                    className="group rounded-[22px] border border-white/8 bg-white/[0.03] p-6 transition-all duration-200 hover:border-white/12 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start gap-3">
                      <Star className="mt-0.5 h-4 w-4 shrink-0 text-gold/50 group-hover:text-gold/75 transition-colors" />
                      <div>
                        <h3 className="text-[17px] font-semibold text-white/85">
                          {item.question}
                        </h3>
                        <p className="mt-3 text-[15px] leading-7 text-white/50">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-background py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(109,90,230,0.14),transparent_65%)]" />
        <div className="absolute inset-0 dot-grid-sm" />

        <div className="container relative mx-auto max-w-[1100px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[hsl(252,30%,6%)] px-8 py-16 text-center text-white shadow-[0_30px_100px_rgba(109,90,230,0.18),0_0_0_1px_rgba(255,255,255,0.04)] sm:px-14 sm:py-20">
            {/* Inner radial glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(232,194,106,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(109,90,230,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(109,90,230,0.10),transparent_55%)]" />
            {/* Top edge glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            {/* Bottom edge glow */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
                <Zap className="h-3.5 w-3.5 text-gold/60" />
                Ready to explore
              </div>
              <h2 className="mt-6 text-[34px] font-extrabold tracking-[-0.04em] text-white sm:text-[50px]">
                Your next great idea<br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-gold via-amber-300 to-gold bg-clip-text text-transparent">
                  {" "}is already here.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.8] text-white/55">
                Browse the marketplace, unlock what intrigues you, or start
                selling your own expertise.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-[12px] bg-gold px-8 font-semibold text-gold-foreground shadow-[var(--shadow-gold-glow)] hover:bg-gold/90 hover:shadow-[0_6px_28px_rgba(232,194,106,0.45)] transition-all duration-300"
                >
                  <Link href="/ideas">Explore ideas</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-[12px] border-white/12 bg-white/[0.04] px-8 text-white hover:bg-white/[0.08] hover:text-white hover:border-white/18 transition-all duration-300"
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

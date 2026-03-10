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
    icon: Search,
    title: "Browse market-ready teasers",
    description:
      "Each listing gives you just enough context to judge the opportunity before you decide to unlock it.",
  },
  {
    icon: Lock,
    title: "Unlock the full idea instantly",
    description:
      "Pay for the ideas you want instead of subscribing to broad content that may never become useful.",
  },
  {
    icon: Wallet,
    title: "Keep access while creators get paid",
    description:
      "Buyers unlock access immediately, and creators monetize insight in a format that feels professional and clear.",
  },
] as const;

const BUYER_POINTS = [
  "See what the idea is about before paying",
  "Browse by category instead of digging through noise",
  "Unlock once and keep access",
] as const;

const CREATOR_POINTS = [
  "Monetize expertise without publishing everything publicly",
  "Use pricing that reflects depth and scarcity",
  "Sell inside a marketplace built for discovery and trust",
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
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-white/60" : "text-[#5B4BCF]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[30px] font-bold tracking-[-0.03em] sm:text-[40px] ${
          dark ? "text-white" : "text-[#0F172A]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[17px] leading-8 ${
            dark ? "text-white/72" : "text-[#475569]"
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
      <p className="mt-2 text-2xl font-bold tracking-tight text-white">
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
      className={`rounded-[24px] border p-5 backdrop-blur-sm ${
        muted
          ? "border-white/8 bg-white/[0.04]"
          : "border-white/12 bg-white/[0.06] shadow-[0_18px_60px_rgba(0,0,0,0.28)]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
          {category}
        </span>
        <span className="text-sm font-semibold text-white">{price}</span>
      </div>
      <h3 className="mt-4 text-[17px] font-semibold leading-7 text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-white/56">
        Full idea stays hidden until purchase.
      </p>
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
    <div className="bg-[#F8F9FC] text-[#0F172A]">
      <section className="relative overflow-hidden bg-[#0B1020] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.06),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.14]" />

        <div className="container relative mx-auto max-w-[1400px] px-6 pb-20 pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/72 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[#C4B5FD]" />
                Curated creator marketplace
              </div>

              <h1 className="mt-7 text-[44px] font-bold tracking-[-0.05em] text-white sm:text-[60px] sm:leading-[1.02] lg:text-[72px]">
                Discover the ideas people don’t publish for free.
              </h1>

              <p className="mt-6 max-w-2xl text-[18px] leading-8 text-white/70 sm:text-[20px]">
                MysteryMarket is a marketplace for high-signal strategies,
                concepts, and business insight. Browse what creators are willing
                to stand behind, unlock what is worth paying for, and understand
                the product without guessing how it works.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-[12px] bg-white px-7 text-[#111827] hover:bg-white/90"
                >
                  <Link href="/ideas">
                    Explore the marketplace
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
              <div className="absolute -left-6 top-8 h-36 w-36 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-white/5 blur-3xl" />

              <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-5">
                <div className="rounded-[26px] border border-white/10 bg-[#0F172A]/85 p-5">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                        Marketplace preview
                      </p>
                      <p className="mt-2 text-sm text-white/60">
                        A premium way to browse ideas that are worth paying
                        attention to.
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      Live model
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

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(11,16,32,0.55))]" />
        </div>
      </section>

      <section className="bg-white py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="A marketplace model built around clarity and paid access"
            description="The page should answer the core questions directly: what buyers see, what they unlock, and why creators would choose this instead of publishing everything publicly."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-[#E7EBF3] bg-[#F8FAFC] p-7 shadow-[0_8px_28px_rgba(15,23,42,0.03)]"
                >
                  <div className="text-[#111827]">
                    <IconBadge icon={Icon} />
                  </div>
                  <h3 className="mt-6 text-[22px] font-semibold tracking-tight text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#475569]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E7EBF3] bg-[#F8F9FC] py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5B4BCF]">
                Featured marketplace picks
              </p>
              <h2 className="mt-3 text-[30px] font-bold tracking-[-0.03em] text-[#0F172A] sm:text-[40px]">
                Popular ideas buyers are already unlocking
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-[#475569]">
                The strongest proof is the marketplace itself. Show visitors
                what high-value listings look like and let the product explain
                the promise.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-[12px] border-[#DCE3F1] bg-white"
            >
              <Link href="/ideas">
                Browse all ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredIdeas.length === 0 ? (
            <div className="mt-10 rounded-[24px] border border-dashed border-[#DCE3F1] bg-white p-12 text-center text-[#64748B]">
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

      <section className="bg-white py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[30px] border border-[#E7EBF3] bg-[#0F172A] p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="For buyers"
                title="Find ideas with clearer signal and less noise"
                description="MysteryMarket is designed to feel more intentional than public content platforms. You browse with context, not guesswork."
                align="left"
                dark
              />

              <div className="mt-8 space-y-4">
                {BUYER_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 text-white/84">
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
                  className="rounded-[12px] bg-white text-[#111827] hover:bg-white/90"
                >
                  <Link href="/ideas">Explore the marketplace</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-[30px] border border-[#E7EBF3] bg-[#F8FAFC] p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="For creators"
                title="Sell your best thinking in a format that feels premium"
                description="Package your expertise with clearer framing, stronger pricing logic, and a marketplace context that makes paid insight feel natural."
                align="left"
              />

              <div className="mt-8 space-y-4">
                {CREATOR_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 text-[#111827]">
                      <IconBadge icon={CheckCircle2} />
                    </div>
                    <p className="text-[15px] leading-7 text-[#475569]">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="rounded-[12px] bg-[#6D5AE6] hover:bg-[#5E4FD1]"
                >
                  <Link href="/sign-up">Sell your ideas</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-[12px] border-[#DCE3F1] bg-white"
                >
                  <Link href="/ideas">See live listings</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E7EBF3] bg-[#F8F9FC] py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[30px] border border-[#E7EBF3] bg-white p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="Explore by category"
                title="Start with the domain you understand best"
                description="Category entry points make the marketplace easier to navigate and easier to trust on a first visit."
                align="left"
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/ideas/category/${category.slug}`}
                      className="group rounded-[22px] border border-[#E7EBF3] bg-[#F8FAFC] p-5 transition-all hover:-translate-y-[1px] hover:bg-white"
                    >
                      <div className="text-[#111827]">
                        <IconBadge icon={Icon} />
                      </div>
                      <h3 className="mt-5 text-base font-semibold text-[#0F172A]">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#475569]">
                        {category.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-[#E7EBF3] bg-white p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="Questions answered"
                title="What people usually want to know before exploring"
                description="The marketing page should explain the model clearly enough that a first-time visitor understands why the product exists and how it works."
                align="left"
              />

              <div className="mt-10 space-y-4">
                {FAQS.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[22px] border border-[#E7EBF3] bg-[#F8FAFC] p-6"
                  >
                    <h3 className="text-[18px] font-semibold text-[#0F172A]">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-[15px] leading-7 text-[#475569]">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="container mx-auto max-w-[1100px] px-6 lg:px-8">
          <div className="rounded-[32px] border border-[#E7EBF3] bg-[#0F172A] px-8 py-14 text-center text-white shadow-[0_24px_80px_rgba(15,23,42,0.16)] sm:px-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
              Get started
            </p>
            <h2 className="mt-4 text-[34px] font-bold tracking-[-0.03em] text-white sm:text-[46px]">
              Explore what’s worth unlocking.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-8 text-white/72">
              Browse the marketplace, discover ideas with real commercial
              framing, or start selling your own expertise in a product
              environment built around paid access.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[12px] bg-white px-7 text-[#111827] hover:bg-white/90"
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
      </section>
    </div>
  );
}

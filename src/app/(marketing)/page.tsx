import Link from "next/link";
import {
  ArrowRight,
  Lock,
  DollarSign,
  Wallet,
  Code,
  Bot,
  Palette,
  Rocket,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Users,
  TrendingUp,
  Star,
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
    desc: "AI products, workflow systems, prompt stacks, and automation concepts.",
    slug: "ai-automation",
  },
  {
    icon: Code,
    name: "Software & Tech",
    desc: "Developer tools, SaaS angles, product strategy, and technical insight.",
    slug: "software-technology",
  },
  {
    icon: Palette,
    name: "Design & Creative",
    desc: "Creative direction, visual systems, brand ideas, and design-led concepts.",
    slug: "design-visual-arts",
  },
] as const;

const HOW_IT_WORKS = [
  {
    icon: Lock,
    step: "01",
    title: "Creators publish the teaser, not the whole playbook",
    description:
      "Each listing gives buyers enough context to judge the value, while keeping the full idea gated until it is unlocked.",
  },
  {
    icon: DollarSign,
    step: "02",
    title: "Buyers unlock what is actually worth their attention",
    description:
      "Browse by category, price, and traction. Pay once for the ideas you want instead of subscribing to generic noise.",
  },
  {
    icon: Wallet,
    step: "03",
    title: "The platform rewards clarity, trust, and real expertise",
    description:
      "Secure checkout, transparent pricing, and marketplace context make strong ideas easier to discover and sell.",
  },
] as const;

const BUYER_POINTS = [
  "Find ideas with clearer signal and less noise",
  "Browse live marketplace demand instead of generic content feeds",
  "Unlock instantly and keep access forever",
];

const CREATOR_POINTS = [
  "Monetize expertise without turning everything into public content",
  "Choose pricing that reflects scarcity and depth",
  "Sell inside a marketplace built for discovery and trust",
];

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Secure purchasing flow",
    description: "Transactions are handled through a professional checkout experience designed to build confidence.",
  },
  {
    icon: TrendingUp,
    title: "Creator-owned value",
    description: "Ideas are priced by the people who made them, not buried in a one-size-fits-all subscription model.",
  },
  {
    icon: Users,
    title: "Built for a real two-sided marketplace",
    description: "The experience supports both discovery for buyers and monetization for creators without mixing the messaging.",
  },
] as const;

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";

  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-semibold uppercase tracking-[0.24em] ${
            isDark ? "text-[#A5B4FC]" : "text-[#4F46E5]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[32px] font-bold tracking-[-0.03em] sm:text-[42px] ${
          isDark ? "text-white" : "text-[#0F172A]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-[17px] leading-8 ${
            isDark ? "text-white/72" : "text-[#475569]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#DCE3F1] bg-white/80 p-5 backdrop-blur-sm shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-[#0F172A]">{value}</p>
    </div>
  );
}

function PreviewIdeaCard({
  title,
  category,
  price,
  note,
}: {
  title: string;
  category: string;
  price: string;
  note: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C7D2FE]">
          {category}
        </span>
        <span className="text-sm font-semibold text-white">{price}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-7 text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/62">{note}</p>
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/56">
        <span>Teaser visible</span>
        <span>Full idea unlocks on purchase</span>
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
    <div className="bg-[#F7F8FC] text-[#0F172A]">
      <section className="relative overflow-hidden bg-[#0B1020] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.35),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.18]" />

        <div className="container relative mx-auto max-w-[1400px] px-6 pb-24 pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/78 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-[#F4B942]" />
                Curated creator marketplace
              </div>

              <h1 className="mt-7 max-w-3xl text-[44px] font-bold tracking-[-0.05em] text-white sm:text-[60px] sm:leading-[1.02] lg:text-[72px]">
                Discover the ideas people don&apos;t publish for free.
              </h1>

              <p className="mt-6 max-w-2xl text-[18px] leading-8 text-white/72 sm:text-[20px]">
                MysteryMarket is a marketplace for high-signal strategies, concepts, and business insight. Browse what creators are willing to stand behind, unlock what is worth your money, and keep access forever.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-[12px] bg-white px-7 text-[#111B3A] hover:bg-white/90">
                  <Link href="/ideas">
                    Explore the marketplace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-[12px] border-white/20 bg-white/5 px-7 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/sign-up">Sell your ideas</Link>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <ShieldCheck className="h-4 w-4 text-[#A5B4FC]" />
                  Secure checkout
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <TrendingUp className="h-4 w-4 text-[#A5B4FC]" />
                  Creator-owned pricing
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                  <Star className="h-4 w-4 text-[#F4B942]" />
                  Unlock and keep access
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-12 h-40 w-40 rounded-full bg-[#8B5CF6]/20 blur-3xl" />
              <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#4F46E5]/25 blur-3xl" />

              <div className="relative rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_32px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-5">
                <div className="rounded-[26px] border border-white/10 bg-[#111831]/80 p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#A5B4FC]">Live marketplace preview</p>
                      <p className="mt-2 text-sm text-white/60">A better way to browse strategic knowledge</p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/72">
                      Buyer view
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <PreviewIdeaCard
                      category="AI & Automation"
                      title="A micro-SaaS workflow agencies can sell to local service businesses in under 14 days"
                      price="$49"
                      note="Includes positioning angle, onboarding structure, and why this category converts faster than custom retainers."
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <PreviewIdeaCard
                        category="Startup Ideas"
                        title="A niche marketplace idea with built-in repeat demand"
                        price="$79"
                        note="Strong operator logic, low-contentious acquisition path, and clear monetization model."
                      />
                      <PreviewIdeaCard
                        category="Design & Creative"
                        title="A productized visual system service for small B2B teams"
                        price="$39"
                        note="Designed for creators who want to package strategic design thinking into sellable expertise."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-10 z-10">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-4 rounded-[28px] border border-[#DCE3F1] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,248,252,0.98))] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.10)] sm:grid-cols-3 sm:p-6">
            <MetricCard label="Published ideas" value={totalIdeas.toLocaleString()} />
            <MetricCard label="Successful unlocks" value={totalPurchases.toLocaleString()} />
            <MetricCard label="Active creators" value={totalCreators.toLocaleString()} />
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FC] py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="A clearer model for buying and selling high-value ideas"
            description="The platform is built around selective discovery: enough context to evaluate the opportunity, and a cleaner path to paying for what is genuinely useful."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.04)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#EEF2FF] text-[#4F46E5]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="text-xs font-bold tracking-[0.24em] text-[#94A3B8]">{item.step}</span>
                  </div>
                  <h3 className="mt-6 text-[22px] font-semibold tracking-tight text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#475569]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-white py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4F46E5]">
                Featured marketplace picks
              </p>
              <h2 className="mt-3 text-[32px] font-bold tracking-[-0.03em] text-[#0F172A] sm:text-[42px]">
                See what buyers are already choosing to unlock
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-[#475569]">
                The homepage should feel like a live marketplace, not a generic brochure. These featured listings bring real demand and product proof directly into the first visit.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-[12px] border-[#DCE3F1] bg-white">
              <Link href="/ideas">
                Browse all ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredIdeas.length === 0 ? (
            <div className="mt-10 rounded-[24px] border border-dashed border-[#DCE3F1] bg-[#F8FAFC] p-12 text-center text-[#64748B]">
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

      <section className="bg-[#F7F8FC] py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[30px] border border-[#DCE3F1] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFF_100%)] p-8 shadow-[0_20px_60px_rgba(79,70,229,0.08)] sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="Explore by category"
                title="Start with the domain you understand best"
                description="A marketplace feels easier to trust when visitors can enter through a clear category instead of being forced into a generic feed."
                align="left"
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/ideas/category/${category.slug}`}
                      className="group rounded-[20px] border border-[#E2E8F0] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-[#C7D2FE] hover:shadow-[0_16px_40px_rgba(79,70,229,0.08)]"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#EEF2FF] text-[#4F46E5]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[#0F172A] transition-colors group-hover:text-[#4338CA]">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#475569]">{category.desc}</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[30px] border border-[#DCE3F1] bg-[#0F172A] p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.20)] sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A5B4FC]">For buyers</p>
                <h3 className="mt-4 text-[30px] font-bold tracking-[-0.03em]">Find signal before you spend time.</h3>
                <div className="mt-6 space-y-4">
                  {BUYER_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#C7D2FE]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[15px] leading-7 text-white/74">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Button asChild className="rounded-[12px] bg-white text-[#111B3A] hover:bg-white/90">
                    <Link href="/ideas">Explore the marketplace</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-[30px] border border-[#DCE3F1] bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4F46E5]">For creators</p>
                <h3 className="mt-4 text-[30px] font-bold tracking-[-0.03em] text-[#0F172A]">Package expertise without giving everything away for free.</h3>
                <div className="mt-6 space-y-4">
                  {CREATOR_POINTS.map((point) => (
                    <div key={point} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF2FF] text-[#4F46E5]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[15px] leading-7 text-[#475569]">{point}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="rounded-[12px] bg-[#4F46E5] hover:bg-[#4338CA]">
                    <Link href="/sign-up">Sell your ideas</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-[12px] border-[#DCE3F1] bg-white">
                    <Link href="/ideas">See live listings</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-white py-24 lg:py-28">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="Why it feels different"
            title="A marketplace that treats ideas like products, not disposable content"
            description="The redesign shifts the homepage away from generic SaaS framing and toward trust, selectivity, and creator-led value."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {TRUST_POINTS.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-7 transition-colors duration-200 hover:bg-white"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white text-[#4F46E5] shadow-[0_8px_24px_rgba(79,70,229,0.08)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#0F172A]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#475569]">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F8FC] py-24">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#312E81_0%,#4338CA_45%,#6366F1_100%)] px-8 py-14 text-white shadow-[0_32px_90px_rgba(67,56,202,0.30)] sm:px-12 sm:py-16">
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-10 bottom-0 h-40 w-40 rounded-full bg-[#F4B942]/20 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/15 text-white backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-[34px] font-bold tracking-[-0.03em] text-white sm:text-[46px]">
                Start exploring what&apos;s worth unlocking.
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-white/82">
                Browse the marketplace, discover ideas with real commercial framing, or turn your own expertise into something buyers can unlock instantly.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-[12px] bg-white px-7 text-[#312E81] hover:bg-white/92">
                  <Link href="/ideas">Explore ideas</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-[12px] border-white/30 bg-white/10 px-7 text-white hover:bg-white/15 hover:text-white"
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
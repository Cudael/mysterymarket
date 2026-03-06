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
  Quote,
  Lightbulb,
  Users,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Hero } from "@/components/layout/hero";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const CATEGORIES = [
  { icon: Rocket, name: "Startup Ideas", desc: "Venture concepts, business models, and operator insights.", slug: "startup-business-ideas" },
  { icon: Bot, name: "AI & Automation", desc: "AI products, prompt systems, agents, and workflow automation.", slug: "ai-automation" },
  { icon: Code, name: "Software & Tech", desc: "SaaS opportunities, developer tools, and product strategy.", slug: "software-technology" },
  { icon: Palette, name: "Design & Arts", desc: "Creative direction, visual systems, and design-led concepts.", slug: "design-visual-arts" },
];

const HOW_IT_WORKS = [
  {
    icon: Lock,
    title: "Create a premium listing",
    description: "Write your insight, add a teaser, and package the value clearly for buyers.",
  },
  {
    icon: DollarSign,
    title: "Set price and access model",
    description: "Choose exclusive or multi-unlock distribution based on scarcity and value.",
  },
  {
    icon: Wallet,
    title: "Get paid as buyers unlock",
    description: "Use Stripe-powered payouts and monetize expertise with transparent economics.",
  },
];

const CREATOR_BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Monetize expertise directly",
    description: "Turn niche experience, frameworks, and opportunities into premium digital inventory.",
  },
  {
    icon: TrendingUp,
    title: "Built for high-intent buyers",
    description: "Position your ideas in a marketplace designed around value, not vanity metrics.",
  },
  {
    icon: Users,
    title: "Professional brand positioning",
    description: "Sell insights in an environment that feels more curated and credible than social platforms.",
  },
];

const SOCIAL_PROOF = [
  {
    quote:
      "I paid for a hidden SEO idea on MysteryMarket and got a practical angle I could test immediately. That level of specificity is hard to find elsewhere.",
    author: "Sarah Jenkins",
    role: "Startup Founder",
  },
  {
    quote:
      "The platform makes premium knowledge feel like an asset class. It’s one of the few places where concise expertise can be packaged and sold well.",
    author: "David Chen",
    role: "SaaS Operator",
  },
  {
    quote:
      "What stands out is the presentation. The marketplace makes ideas feel curated, credible, and worth paying attention to.",
    author: "Elena Rodriguez",
    role: "Marketing Director",
  },
];

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#3A5FCD]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[30px] font-bold tracking-tight text-[#111827] sm:text-[38px]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-[17px] leading-8 text-[#1A1A1A]/65">
          {description}
        </p>
      )}
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
    <div className="bg-[#F8F9FC] text-[#1A1A1A]">
      <Hero />

      <section className="border-y border-[#D9DCE3] bg-white">
        <div className="container mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-3 lg:px-8">
          <div className="rounded-[14px] border border-[#E7EAF1] bg-[#FCFCFE] px-5 py-4">
            <p className="text-sm text-[#1A1A1A]/55">Published ideas</p>
            <p className="mt-1 text-2xl font-bold text-[#111827]">{totalIdeas.toLocaleString()}</p>
          </div>
          <div className="rounded-[14px] border border-[#E7EAF1] bg-[#FCFCFE] px-5 py-4">
            <p className="text-sm text-[#1A1A1A]/55">Successful unlocks</p>
            <p className="mt-1 text-2xl font-bold text-[#111827]">{totalPurchases.toLocaleString()}</p>
          </div>
          <div className="rounded-[14px] border border-[#E7EAF1] bg-[#FCFCFE] px-5 py-4">
            <p className="text-sm text-[#1A1A1A]/55">Active creators</p>
            <p className="mt-1 text-2xl font-bold text-[#111827]">{totalCreators.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="How it works"
          title="A cleaner way to package and monetize valuable ideas"
          description="Designed for experts who want better positioning and buyers who want faster access to useful insight."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-[18px] border border-[#D9DCE3] bg-white p-7 shadow-[0_8px_30px_rgba(17,24,39,0.04)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#3A5FCD]/10 text-[#3A5FCD]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-[#111827]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[#1A1A1A]/65">{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#D9DCE3] bg-white">
        <div className="container mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3A5FCD]">
                Featured marketplace picks
              </p>
              <h2 className="mt-3 text-[30px] font-bold tracking-tight text-[#111827] sm:text-[38px]">
                Popular ideas buyers are unlocking
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-[#1A1A1A]/65">
                Showcase your strongest inventory and help new users understand the quality of the marketplace.
              </p>
            </div>

            <Button asChild variant="outline" className="rounded-[10px] border-[#D9DCE3] bg-white">
              <Link href="/ideas">
                Browse all ideas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

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
        </div>
      </section>

      <section className="container mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="Explore by category"
          title="Browse high-value ideas by domain"
          description="Use category entry points to help buyers find relevant opportunities faster."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/ideas/category/${category.slug}`}
                className="group rounded-[18px] border border-[#D9DCE3] bg-white p-6 shadow-[0_8px_30px_rgba(17,24,39,0.04)] transition-all hover:-translate-y-[2px] hover:border-[#3A5FCD]/30 hover:shadow-[0_14px_40px_rgba(58,95,205,0.10)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#3A5FCD]/10 text-[#3A5FCD]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#111827] group-hover:text-[#3A5FCD]">
                  {category.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/65">{category.desc}</p>
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-[#3A5FCD]">
                  Explore category
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#D9DCE3] bg-white">
        <div className="container mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
          <SectionHeader
            eyebrow="For creators"
            title="Built to make expertise feel premium"
            description="Create stronger positioning for your ideas with a marketplace designed around quality, scarcity, and discoverability."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {CREATOR_BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[18px] border border-[#D9DCE3] bg-[#FCFCFE] p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#3A5FCD]/10 text-[#3A5FCD]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#111827]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#1A1A1A]/65">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-[1400px] px-6 py-20 lg:px-8">
        <SectionHeader
          eyebrow="What people value"
          title="Why the format works"
          description="A more focused marketplace experience creates stronger expectations around quality and usefulness."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {SOCIAL_PROOF.map((item) => (
            <div
              key={item.author}
              className="rounded-[18px] border border-[#D9DCE3] bg-white p-7 shadow-[0_8px_30px_rgba(17,24,39,0.04)]"
            >
              <Quote className="h-7 w-7 text-[#3A5FCD]/35" />
              <p className="mt-5 text-[16px] leading-8 text-[#1A1A1A]/72">
                “{item.quote}”
              </p>
              <div className="mt-6 border-t border-[#E7EAF1] pt-5">
                <p className="font-semibold text-[#111827]">{item.author}</p>
                <p className="mt-1 text-sm text-[#1A1A1A]/55">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="rounded-[28px] border border-[#D9DCE3] bg-[linear-gradient(135deg,#FFFFFF_0%,#F5F7FD_100%)] px-8 py-12 shadow-[0_24px_80px_rgba(17,24,39,0.08)] sm:px-12 sm:py-14">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#3A5FCD]/10 text-[#3A5FCD]">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-[32px] font-bold tracking-tight text-[#111827] sm:text-[40px]">
                Turn insight into inventory — or find your next edge
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-[#1A1A1A]/65">
                Join MysteryMarket to discover premium ideas or start packaging your own expertise for a buyer-ready audience.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-[10px] bg-[#3A5FCD] px-7 hover:bg-[#2D4FB0]">
                  <Link href="/ideas">Explore ideas</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-[10px] border-[#D9DCE3] bg-white px-7">
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

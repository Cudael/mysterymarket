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
  CheckCircle2,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Hero } from "@/components/layout/hero";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const CATEGORIES = [
  {
    icon: Rocket,
    name: "Startup Ideas",
    desc: "Venture concepts, business models, and operator insights.",
    slug: "startup-business-ideas",
  },
  {
    icon: Bot,
    name: "AI & Automation",
    desc: "AI products, prompt systems, agents, and workflow automation.",
    slug: "ai-automation",
  },
  {
    icon: Code,
    name: "Software & Tech",
    desc: "SaaS opportunities, developer tools, and product strategy.",
    slug: "software-technology",
  },
  {
    icon: Palette,
    name: "Design & Arts",
    desc: "Creative direction, visual systems, and design-led concepts.",
    slug: "design-visual-arts",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Lock,
    title: "Create a premium listing",
    description:
      "Write your insight, add a teaser, and package the value clearly for buyers.",
  },
  {
    icon: DollarSign,
    title: "Set price and access model",
    description:
      "Choose exclusive or multi-unlock distribution based on scarcity and value.",
  },
  {
    icon: Wallet,
    title: "Get paid as buyers unlock",
    description:
      "Use Stripe-powered payouts and monetize expertise with transparent economics.",
  },
];

const CREATOR_POINTS = [
  "Monetize high-value expertise directly",
  "Position ideas in a premium environment",
  "Use exclusivity or multi-unlock pricing",
  "Reach buyers looking for actionable insight",
];

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
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
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

      <section className="relative -mt-2">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 rounded-[24px] border border-[#D9DCE3] bg-white p-4 shadow-[0_16px_50px_rgba(17,24,39,0.06)] sm:grid-cols-3 sm:p-6">
            <div className="rounded-[16px] bg-[#F8F9FC] px-5 py-4">
              <p className="text-sm text-[#1A1A1A]/55">Published ideas</p>
              <p className="mt-1 text-2xl font-bold text-[#111827]">
                {totalIdeas.toLocaleString()}
              </p>
            </div>
            <div className="rounded-[16px] bg-[#F8F9FC] px-5 py-4">
              <p className="text-sm text-[#1A1A1A]/55">Successful unlocks</p>
              <p className="mt-1 text-2xl font-bold text-[#111827]">
                {totalPurchases.toLocaleString()}
              </p>
            </div>
            <div className="rounded-[16px] bg-[#F8F9FC] px-5 py-4">
              <p className="text-sm text-[#1A1A1A]/55">Active creators</p>
              <p className="mt-1 text-2xl font-bold text-[#111827]">
                {totalCreators.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Background: White */}
      <div className="bg-white py-24 mt-20">
        <section className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="How it works"
            title="A premium marketplace model built around clarity and value"
            description="MysteryMarket helps experts package high-value knowledge while giving buyers a faster path to useful, actionable ideas."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="relative rounded-[20px] border border-[#D9DCE3] bg-[#F8F9FC] p-7 shadow-[0_10px_35px_rgba(17,24,39,0.03)]"
                >
                  <div className="absolute right-5 top-5 text-xs font-bold text-[#3A5FCD]/25">
                    0{index + 1}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[#3A5FCD]/10 text-[#3A5FCD]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#111827]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-[#1A1A1A]/65">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Back to light gray background */}
      <section className="container mx-auto max-w-[1400px] px-6 py-24 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3A5FCD]">
              Featured marketplace picks
            </p>
            <h2 className="mt-3 text-[30px] font-bold tracking-tight text-[#111827] sm:text-[38px]">
              Popular ideas buyers are already unlocking
            </h2>
            <p className="mt-4 text-[17px] leading-8 text-[#1A1A1A]/65">
              Lead with marketplace quality. A smaller, stronger selection communicates trust better than too much content at once.
            </p>
          </div>

          <Button asChild variant="outline" className="rounded-[10px] border-[#D9DCE3] bg-white">
            <Link href="/ideas">
              Browse all ideas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredIdeas.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-[#D9DCE3] bg-white p-12 text-center text-[#1A1A1A]/55">
            <p>New ideas are being curated. Check back soon!</p>
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
      </section>

      <section className="container mx-auto max-w-[1400px] px-6 pb-24 lg:px-8">
        <div className="overflow-hidden rounded-[28px] border border-[#D9DCE3] bg-[linear-gradient(180deg,#EEF3FF_0%,#F8F9FC_100%)] shadow-[0_20px_60px_rgba(58,95,205,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10 lg:p-12">
              <SectionHeader
                eyebrow="Explore by category"
                title="Browse high-value ideas by domain"
                description="Guide buyers toward the areas they care about most, without making the homepage feel crowded."
                align="left"
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.slug}
                      href={`/ideas/category/${category.slug}`}
                      className="group rounded-[18px] border border-white/70 bg-white/80 p-5 backdrop-blur-sm transition-all hover:-translate-y-[2px] hover:border-[#3A5FCD]/25 hover:bg-white"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#3A5FCD]/10 text-[#3A5FCD]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[#111827] group-hover:text-[#3A5FCD]">
                        {category.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/65">
                        {category.desc}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#D9DCE3] bg-[#EAF0FF] p-8 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3A5FCD]">
                For creators
              </p>
              <h3 className="mt-3 text-[28px] font-bold tracking-tight text-[#111827]">
                A better environment for selling expertise
              </h3>
              <p className="mt-4 text-[16px] leading-8 text-[#1A1A1A]/68">
                MysteryMarket gives your ideas stronger framing, clearer pricing, and a marketplace context that feels more professional than posting content into the void.
              </p>

              <div className="mt-8 space-y-4">
                {CREATOR_POINTS.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3A5FCD] text-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <p className="text-[15px] leading-7 text-[#1A1A1A]/72">{point}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-[10px] bg-[#3A5FCD] hover:bg-[#2D4FB0]">
                  <Link href="/sign-up">Start selling</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-[10px] border-[#C9D5F1] bg-white/80 hover:bg-white">
                  <Link href="/ideas">See marketplace</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating Background: White for Community Section */}
      <div className="bg-white py-24 border-y border-[#D9DCE3]">
        <section className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <SectionHeader
            eyebrow="Community"
            title="What our early adopters are saying"
            description="We're currently in early access. Be among the first to share your experience buying or selling on MysteryMarket."
          />

          <div className="mt-10 mx-auto max-w-3xl">
            <div className="flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#D9DCE3] bg-[#F8F9FC] px-6 py-12 text-center sm:px-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3A5FCD]/10 text-[#3A5FCD]">
                <Quote className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#111827]">
                Have you unlocked an idea?
              </h3>
              <p className="mt-3 max-w-md text-[15px] leading-7 text-[#1A1A1A]/65">
                Help us build trust in the marketplace. Share how a concept you purchased helped your business, or how selling on the platform has worked for you.
              </p>
              <div className="mt-8">
                <Button asChild className="rounded-[10px] bg-[#111827] px-6 text-white hover:bg-[#111827]/90">
                  <Link href="mailto:hello@mysterymarket.com?subject=My%20MysteryMarket%20Review">
                    Submit a review
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA on default background */}
      <section className="py-24 bg-[#F8F9FC]">
        <div className="container mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#2447A8_0%,#3A5FCD_45%,#6D7BE0_100%)] px-8 py-14 text-white shadow-[0_28px_80px_rgba(36,71,168,0.30)] sm:px-12 sm:py-16">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute left-10 bottom-0 h-40 w-40 rounded-full bg-[#E8C26A]/20 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-white/15 text-white backdrop-blur-sm">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-[32px] font-bold tracking-tight text-white sm:text-[42px]">
                Turn expertise into premium inventory
              </h2>
              <p className="mt-4 text-[17px] leading-8 text-white/82">
                Discover high-value ideas or start selling your own in a marketplace designed to feel credible, curated, and worth paying attention to.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-[10px] bg-white px-7 text-[#2447A8] hover:bg-white/90">
                  <Link href="/ideas">Explore ideas</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-[10px] border-white/30 bg-white/10 px-7 text-white hover:bg-white/15"
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

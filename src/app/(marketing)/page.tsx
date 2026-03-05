import Link from "next/link";
import { ArrowRight, Lock, DollarSign, Wallet, Code, TrendingUp, Palette, Briefcase, Star, Quote } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { Hero } from "@/components/layout/hero";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

const CATEGORIES = [
  { icon: TrendingUp, name: "SaaS Growth", desc: "Scaling strategies & MRR hacks", slug: "marketing" },
  { icon: Briefcase, name: "Business Strategy", desc: "Operations & executive insights", slug: "business" },
  { icon: Code, name: "Engineering", desc: "High-value scripts & architecture", slug: "technology" },
  { icon: Palette, name: "Design Secrets", desc: "UX patterns & creative workflows", slug: "design" },
];

const SOCIAL_PROOF = [
  {
    quote: "I paid $25 for a hidden SEO tactic on MysteryMarket and it doubled my organic traffic in a month. The ROI is unbelievable.",
    author: "Sarah Jenkins",
    role: "Startup Founder"
  },
  {
    quote: "I drafted a 300-word insight about my recent successful exit, priced it at $50, and woke up to $800 in my Stripe account.",
    author: "David Chen",
    role: "SaaS Operator"
  },
  {
    quote: "The mystery aspect forces creators to only post their absolute best material. No fluff, just pure, actionable value.",
    author: "Elena Rodriguez",
    role: "Marketing Director"
  }
];

const HOW_IT_WORKS = [
  {
    icon: Lock,
    title: "Draft your insight",
    description: "Write your hidden idea, craft a compelling teaser, and choose your price point.",
  },
  {
    icon: DollarSign,
    title: "Set your terms",
    description: "Opt for an exclusive single-buyer model or allow multiple unlocks.",
  },
  {
    icon: Wallet,
    title: "Earn instantly",
    description: "Earnings are processed instantly and sent directly to your Stripe account.",
  },
];

export default async function HomePage() {
  const { userId: clerkId } = await auth();

  const [featuredIdeas, bookmarkedIdeaIds] = await Promise.all([
    prisma.idea.findMany({
      where: { published: true },
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { purchases: true } },
      },
      orderBy: { createdAt: "desc" },
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
  ]);

  return (
    <>
      <Hero />

      {/* 1. Explore Categories - Pure White Background */}
      <section className="bg-[#FFFFFF] py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Explore by category
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
              Discover specialized knowledge from industry veterans across various domains.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(({ icon: Icon, name, desc, slug }) => (
              <Link key={name} href={`/ideas/category/${slug}`} className="group flex flex-col rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-6 transition-all duration-200 hover:border-[#3A5FCD]/50 hover:bg-[#FFFFFF] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#FFFFFF] border border-[#D9DCE3] group-hover:border-[#3A5FCD]/20 group-hover:bg-[#3A5FCD]/5">
                  <Icon className="h-5 w-5 text-[#3A5FCD]" />
                </div>
                <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-1">{name}</h3>
                <p className="text-[14px] text-[#1A1A1A]/60 leading-[1.5]">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured Insights - Fog Grey Background */}
      <section className="bg-[#F5F6FA] py-24 border-y border-[#D9DCE3]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-[#D9DCE3] pb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                Featured Insights
              </h2>
              <p className="mt-2 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
                Highly-rated ideas recently unlocked by the community.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 gap-2 bg-[#FFFFFF]">
              <Link href="/ideas">
                View all insights <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredIdeas.length === 0 ? (
              <div className="col-span-full rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <p className="text-[16px] text-[#1A1A1A]/70">
                  No ideas have been published yet. Be the first to create one.
                </p>
              </div>
            ) : (
              featuredIdeas.map((idea) => (
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
              ))
            )}
          </div>
        </div>
      </section>

      {/* 3. Social Proof - Pure White Background */}
      <section className="bg-[#FFFFFF] py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Trusted by professionals
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
              See what creators and buyers are saying about the marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {SOCIAL_PROOF.map((testimonial, idx) => (
              <div key={idx} className="relative rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-[#D9DCE3]" />
                <div className="mb-6 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#E8C26A] text-[#E8C26A]" />
                  ))}
                </div>
                <p className="text-[16px] leading-[1.6] text-[#1A1A1A] mb-8 font-medium">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="mt-auto border-t border-[#D9DCE3] pt-4">
                  <p className="text-[15px] font-bold text-[#1A1A1A]">{testimonial.author}</p>
                  <p className="text-[14px] text-[#1A1A1A]/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works - Fog Grey Background */}
      <section className="bg-[#F5F6FA] py-24 border-t border-[#D9DCE3]">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
              Turn your expertise into income
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#1A1A1A]/70">
              A streamlined, highly secure platform designed for professionals to monetize their insights without the overhead of a full product.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-8 shadow-[0_4px_14px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#F5F6FA] border border-[#D9DCE3]">
                  <Icon className="h-5 w-5 text-[#3A5FCD]" />
                </div>
                <h3 className="mb-3 text-[18px] font-semibold text-[#1A1A1A]">
                  {title}
                </h3>
                <p className="text-[16px] leading-[1.6] text-[#1A1A1A]/70">
                  {description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Button asChild size="lg" className="h-12 px-8 text-[16px]">
                <Link href="/sign-up">Create your first idea</Link>
             </Button>
          </div>
        </div>
      </section>
    </>
  );
}

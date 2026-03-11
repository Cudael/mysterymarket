import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import {
  Rocket,
  Package,
  Code,
  Bot,
  TrendingUp,
  Fingerprint,
  Video,
  PenTool,
  Palette,
  Music,
  Link as LinkIcon,
  DollarSign,
  GraduationCap,
  Heart,
  Compass,
  Sparkles,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { IdeaCard } from "@/features/ideas/components/idea-card";
import { Pagination } from "@/components/shared/pagination";
import { CATEGORY_META, getCategoryBySlug, ITEMS_PER_PAGE } from "@/lib/constants";
import prisma from "@/lib/prisma";

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  Package,
  Code,
  Bot,
  TrendingUp,
  Fingerprint,
  Video,
  PenTool,
  Palette,
  Music,
  Link: LinkIcon,
  DollarSign,
  GraduationCap,
  Heart,
  Compass,
  Sparkles,
};

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Not Found" };

  return {
    title: `${category.name} Ideas - MysteryMarket`,
    description: category.description,
  };
}

export function generateStaticParams() {
  return Object.values(CATEGORY_META).map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.page ?? "1", 10));
  const sortBy = sp?.sortBy ?? "";

  const { userId: clerkId } = await auth();

  const where = {
    published: true,
    category: category.name,
  };

  const orderBy =
    sortBy === "price-low"
      ? { priceInCents: "asc" as const }
      : sortBy === "price-high"
        ? { priceInCents: "desc" as const }
        : { createdAt: "desc" as const };

  const [ideas, total, bookmarkedIdeaIds] = await Promise.all([
    prisma.idea.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, avatarUrl: true } },
        _count: { select: { purchases: true } },
      },
      orderBy,
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.idea.count({ where }),
    clerkId
      ? prisma.bookmark
          .findMany({
            where: { user: { clerkId } },
            select: { ideaId: true },
          })
          .then((bs) => new Set(bs.map((b) => b.ideaId)))
      : Promise.resolve(new Set<string>()),
  ]);

  const sortedIdeas =
    sortBy === "most-purchased"
      ? [...ideas].sort((a, b) => b._count.purchases - a._count.purchases)
      : ideas;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const CategoryIcon = ICON_MAP[category.icon] ?? Sparkles;

  const relatedCategories = Object.values(CATEGORY_META).filter(
    (c) => c.slug !== slug
  );

  return (
    <div className="bg-[hsl(var(--surface))] min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[hsl(var(--muted))] to-[hsl(var(--background))] border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-[1400px] py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <Link href="/ideas" className="text-muted-foreground hover:text-primary transition-colors">
              Marketplace
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-medium">{category.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] bg-primary/10 border border-primary/20 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
              <CategoryIcon className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-foreground">
                {category.name} Ideas
              </h1>
              <p className="mt-1.5 text-[16px] leading-[1.6] text-muted-foreground max-w-2xl">
                {category.description}
              </p>
            </div>
          </div>

          {total > 0 && (
            <p className="mt-5 text-[15px] font-medium text-primary">
              {total} {total === 1 ? "idea" : "ideas"} available
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 max-w-[1400px] py-12">
        {sortedIdeas.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center rounded-[12px] border border-dashed border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted border border-border">
              <Lightbulb className="h-7 w-7 text-primary/40" />
            </div>
            <p className="text-[18px] font-bold text-foreground">
              No mysteries in this category yet
            </p>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Be the first to share something worth discovering
            </p>
            <Link
              href="/ideas"
              className="mt-6 inline-flex items-center gap-2 rounded-[8px] bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Explore all ideas
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {sortedIdeas.map((idea) => (
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

            {totalPages > 1 && (
              <div className="flex justify-center pt-8 border-t border-border">
                <Suspense fallback={null}>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    basePath={`/ideas/category/${slug}`}
                  />
                </Suspense>
              </div>
            )}
          </>
        )}

        {/* Related Categories */}
        <div className="mt-16 pt-10 border-t border-border">
          <h2 className="text-[20px] font-bold text-foreground mb-6">Explore Other Categories</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {relatedCategories.map((cat) => {
              const RelatedIcon = ICON_MAP[cat.icon] ?? Sparkles;
              return (
                <Link
                  key={cat.slug}
                  href={`/ideas/category/${cat.slug}`}
                  className="flex shrink-0 items-center gap-2.5 rounded-[10px] border border-border bg-card px-4 py-3 text-[14px] font-medium text-foreground transition-all hover:border-primary/50 hover:bg-muted hover:text-primary shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                >
                  <RelatedIcon className="h-4 w-4 text-primary shrink-0" />
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

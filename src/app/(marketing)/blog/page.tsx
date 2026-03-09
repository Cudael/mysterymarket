import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { getAllPosts, getFeaturedPosts } from "@/content/blog/registry";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/content/blog/constants";
import type { BlogPost } from "@/content/blog/index";

export const metadata: Metadata = {
  title: "Blog - MysteryMarket",
  description:
    "Insights, guides, and creator stories from the MysteryMarket community. Learn how to price, sell, and discover premium ideas.",
};

function CategoryBadge({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
        CATEGORY_COLORS[category] ?? "bg-[#F5F6FA] text-[#1A1A1A] border-[#D9DCE3]"
      }`}
    >
      {CATEGORY_LABELS[category] ?? category}
    </span>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#6D7BE0]/40"
    >
      {/* Cover image or gradient placeholder */}
      <div className="relative h-44 w-full overflow-hidden border-b border-[#D9DCE3] bg-gradient-to-br from-[#F5F6FA] to-[#EEF0F8]">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-[#3A5FCD]/10 flex items-center justify-center">
              <Tag className="h-5 w-5 text-[#3A5FCD]/50" />
            </div>
          </div>
        )}
        <div className="absolute left-4 top-4">
          <CategoryBadge category={post.category} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="line-clamp-2 text-[18px] font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          {post.excerpt}
        </p>

        <div className="mt-auto pt-5 border-t border-[#D9DCE3] mt-5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/50">
            <div className="h-6 w-6 rounded-full bg-[#3A5FCD]/10 flex items-center justify-center text-[10px] font-bold text-[#3A5FCD]">
              {post.author.name.charAt(0)}
            </div>
            <span className="font-medium text-[#1A1A1A]/70">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#1A1A1A]/50">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col md:flex-row overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_14px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:border-[#6D7BE0]/40"
    >
      <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-[#D9DCE3] bg-gradient-to-br from-[#3A5FCD]/5 to-[#6D7BE0]/10">
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-[#3A5FCD]/10 flex items-center justify-center">
              <Tag className="h-6 w-6 text-[#3A5FCD]/40" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge category={post.category} />
            <span className="inline-flex items-center rounded-[6px] bg-[#E8C26A]/10 border border-[#E8C26A]/30 px-2.5 py-1 text-xs font-medium text-[#1A1A1A]">
              Featured
            </span>
          </div>
          <h2 className="text-[22px] font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors leading-tight">
            {post.title}
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#1A1A1A]/60 line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#D9DCE3]">
          <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
            <div className="h-7 w-7 rounded-full bg-[#3A5FCD]/10 flex items-center justify-center text-xs font-bold text-[#3A5FCD]">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <span className="font-medium text-[#1A1A1A]/80">{post.author.name}</span>
              <span className="mx-1.5 text-[#D9DCE3]">&middot;</span>
              <span>{post.author.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#1A1A1A]/50">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const allPosts = getAllPosts();
  const featuredPosts = getFeaturedPosts();

  const filteredPosts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  const categories = [
    { value: "", label: "All" },
    { value: "guides", label: "Guides" },
    { value: "insights", label: "Insights" },
    { value: "creator-stories", label: "Creator Stories" },
    { value: "platform-updates", label: "Platform Updates" },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#EEF0F8] to-[#F5F6FA] border-b border-[#D9DCE3] py-20">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">
            The MysteryMarket Blog
          </h1>
          <p className="mt-4 text-[17px] leading-[1.7] text-[#1A1A1A]/60 max-w-2xl mx-auto">
            Insights, guides, and creator stories to help you succeed &mdash; whether you&apos;re
            selling knowledge or discovering it.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl py-14">
        {/* Featured posts — only shown when no category filter */}
        {!category && featuredPosts.length > 0 && (
          <section className="mb-14">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 mb-5">
              Featured
            </h2>
            <div className="flex flex-col gap-5">
              {featuredPosts.map((post) => (
                <FeaturedCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={cat.value ? `/blog?category=${cat.value}` : "/blog"}
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-[14px] font-medium transition-colors ${
                (category ?? "") === cat.value
                  ? "bg-[#3A5FCD] border-[#3A5FCD] text-white"
                  : "bg-[#FFFFFF] border-[#D9DCE3] text-[#1A1A1A]/70 hover:border-[#3A5FCD]/40 hover:text-[#3A5FCD]"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Post grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-[#1A1A1A]/40">
            <p className="text-lg font-medium">No posts in this category yet.</p>
            <p className="mt-2 text-sm">Check back soon &mdash; we&apos;re always writing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


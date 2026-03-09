import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import {
  getPostBySlug,
  getPostsByCategory,
} from "@/content/blog/registry";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/content/blog/constants";
import { Button } from "@/components/ui/button";
import { CopyLinkButton } from "./copy-link-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} - MysteryMarket Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getPostsByCategory(post.category)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const categoryColor =
    CATEGORY_COLORS[post.category] ??
    "bg-[#F5F6FA] text-[#1A1A1A] border-[#D9DCE3]";
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm text-[#1A1A1A]/50 mb-8">
          <Link href="/" className="hover:text-[#3A5FCD] transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <Link href="/blog" className="hover:text-[#3A5FCD] transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-[#1A1A1A]/80 line-clamp-1">{post.title}</span>
        </nav>

        {/* Article header */}
        <header className="mb-8">
          <span
            className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium mb-4 ${categoryColor}`}
          >
            {categoryLabel}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#3A5FCD]/10 flex items-center justify-center text-xs font-bold text-[#3A5FCD]">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {post.author.name}
                </p>
                <p className="text-xs text-[#1A1A1A]/50">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-[#1A1A1A]/50">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readingTime}
              </span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-[#D9DCE3] bg-[#F5F6FA] px-3 py-1 text-xs font-medium text-[#1A1A1A]/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="mb-10 overflow-hidden rounded-[12px] border border-[#D9DCE3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Article content */}
        <article
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share section */}
        <div className="mt-12 rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#1A1A1A]">Share this article</p>
            <p className="text-sm text-[#1A1A1A]/60 mt-0.5">
              Found this helpful? Share it with your network.
            </p>
          </div>
          <CopyLinkButton />
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-14">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-[#1A1A1A]/40 mb-5">
              More in {categoryLabel}
            </h2>
            <div className="flex flex-col gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex items-start gap-4 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-5 transition-all hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-[#6D7BE0]/40"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">
                      {related.title}
                    </p>
                    <p className="mt-1 text-sm text-[#1A1A1A]/60 line-clamp-2">
                      {related.excerpt}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#1A1A1A]/40">
                      <Clock className="h-3 w-3" />
                      {related.readingTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA banner */}
        <section className="mt-14 rounded-[12px] bg-gradient-to-br from-[#3A5FCD] to-[#6D7BE0] p-8 text-white text-center">
          <h2 className="text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-white/80 text-[15px]">
            Explore premium ideas from top creators, or start monetizing your own expertise today.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="bg-white text-[#3A5FCD] hover:bg-white/90 font-semibold px-6 h-11 shadow-none"
            >
              <Link href="/ideas">Explore Marketplace</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-6 h-11"
            >
              <Link href="/studio">Become a Creator</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

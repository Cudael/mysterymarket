import { BlogPost, BlogPostWithContent } from "./index";
import { post as howToPrice } from "./posts/how-to-price-your-idea";
import { post as topIdeasThatSold } from "./posts/top-10-ideas-that-sold";
import { post as creatorSuccessStory } from "./posts/creator-success-story-first-1000";
import { post as whyMysterySells } from "./posts/why-mystery-sells";
import { post as gettingStarted } from "./posts/getting-started-as-a-creator";

const allPosts: BlogPostWithContent[] = [
  howToPrice,
  topIdeasThatSold,
  creatorSuccessStory,
  whyMysterySells,
  gettingStarted,
];

export function getAllPosts(): BlogPost[] {
  return allPosts
    .map(({ content: _content, ...meta }): BlogPost => meta)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getPostBySlug(slug: string): BlogPostWithContent | null {
  return allPosts.find((p) => p.slug === slug) ?? null;
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(allPosts.map((p) => p.category))];
}

export function getAllTags(): string[] {
  return [...new Set(allPosts.flatMap((p) => p.tags))];
}

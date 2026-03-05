export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  category: "guides" | "insights" | "creator-stories" | "platform-updates";
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readingTime: string;
  coverImageUrl?: string;
  tags: string[];
  featured: boolean;
}

export interface BlogPostWithContent extends BlogPost {
  content: string;
}

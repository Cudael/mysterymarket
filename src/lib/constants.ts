export const CATEGORIES = [
  "Technology",
  "Business",
  "Marketing",
  "Design",
  "Education",
  "Health",
  "Finance",
  "Entertainment",
  "Science",
  "Other",
] as const;

export const CATEGORY_META: Record<string, { name: string; slug: string; description: string; icon: string }> = {
  Technology: {
    name: "Technology",
    slug: "technology",
    description: "Cutting-edge tech insights, architecture patterns, scripts, and engineering strategies from industry professionals.",
    icon: "Code",
  },
  Business: {
    name: "Business",
    slug: "business",
    description: "Operations insights, executive strategies, and business growth tactics from experienced operators.",
    icon: "Briefcase",
  },
  Marketing: {
    name: "Marketing",
    slug: "marketing",
    description: "Growth hacks, SEO tactics, conversion strategies, and campaign insights from top marketers.",
    icon: "TrendingUp",
  },
  Design: {
    name: "Design",
    slug: "design",
    description: "UX patterns, creative workflows, design systems, and visual strategies from seasoned designers.",
    icon: "Palette",
  },
  Education: {
    name: "Education",
    slug: "education",
    description: "Teaching methods, curriculum insights, and learning frameworks from education professionals.",
    icon: "GraduationCap",
  },
  Health: {
    name: "Health",
    slug: "health",
    description: "Wellness insights, fitness strategies, and health optimization tips from industry experts.",
    icon: "Heart",
  },
  Finance: {
    name: "Finance",
    slug: "finance",
    description: "Investment strategies, financial planning insights, and money management tactics from finance professionals.",
    icon: "DollarSign",
  },
  Entertainment: {
    name: "Entertainment",
    slug: "entertainment",
    description: "Content creation secrets, audience growth strategies, and entertainment industry insights.",
    icon: "Film",
  },
  Science: {
    name: "Science",
    slug: "science",
    description: "Research insights, scientific breakthroughs, and analytical methodologies from researchers.",
    icon: "Microscope",
  },
  Other: {
    name: "Other",
    slug: "other",
    description: "Unique and cross-disciplinary ideas that don't fit into a single category.",
    icon: "Sparkles",
  },
};

// Helper to get category by slug
export function getCategoryBySlug(slug: string) {
  return Object.values(CATEGORY_META).find((c) => c.slug === slug) ?? null;
}

// Helper to get all category slugs
export function getAllCategorySlugs() {
  return Object.values(CATEGORY_META).map((c) => c.slug);
}

export const ITEMS_PER_PAGE = 12;
export const PLATFORM_FEE_PERCENT = 15;

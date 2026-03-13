export const CATEGORIES = [
  "Startup & Business",
  "Software & Tech",
  "AI & Automation",
  "Marketing & Growth",
  "Product & Design",
  "Creative & Content",
] as const;

export const CATEGORY_META: Record<string, { name: string; slug: string; description: string; icon: string }> = {
  "Startup & Business": {
    name: "Startup & Business",
    slug: "startup-business",
    description: "Venture concepts, business models, and entrepreneurial strategies worth protecting.",
    icon: "Rocket",
  },
  "Software & Tech": {
    name: "Software & Tech",
    slug: "software-tech",
    description: "Apps, tools, developer utilities, and technical concepts ready to be built.",
    icon: "Code",
  },
  "AI & Automation": {
    name: "AI & Automation",
    slug: "ai-automation",
    description: "Prompts, workflows, agents, and AI-native product ideas ahead of the curve.",
    icon: "Bot",
  },
  "Marketing & Growth": {
    name: "Marketing & Growth",
    slug: "marketing-growth",
    description: "Growth playbooks, campaign frameworks, and monetization strategies that actually work.",
    icon: "TrendingUp",
  },
  "Product & Design": {
    name: "Product & Design",
    slug: "product-design",
    description: "UX concepts, product specs, branding directions, and invention blueprints.",
    icon: "Package",
  },
  "Creative & Content": {
    name: "Creative & Content",
    slug: "creative-content",
    description: "Writing formats, creator strategies, content systems, and artistic concepts.",
    icon: "PenTool",
  },
};

export const SUBCATEGORIES: Record<string, Array<{ name: string; slug: string }>> = {
  "Startup & Business": [],
  "Software & Tech": [],
  "AI & Automation": [],
  "Marketing & Growth": [],
  "Product & Design": [],
  "Creative & Content": [],
};

export const IDEA_MATURITY_LEVELS = [
  { value: "SEED", label: "Seed", description: "A raw spark — one-liner or short paragraph" },
  { value: "CONCEPT", label: "Concept", description: "Fleshed out with context, problem, and high-level solution" },
  { value: "BLUEPRINT", label: "Blueprint", description: "Detailed execution plan, market analysis, or technical spec" },
  { value: "PROTOTYPE_READY", label: "Prototype-Ready", description: "Includes wireframes, mockups, pseudocode, or working models" },
] as const;

// Helper to get category by slug
export function getCategoryBySlug(slug: string) {
  return Object.values(CATEGORY_META).find((c) => c.slug === slug) ?? null;
}

// Helper to get all category slugs
export function getAllCategorySlugs() {
  return Object.values(CATEGORY_META).map((c) => c.slug);
}

// Helper to get subcategories for a given category name
export function getSubcategoriesByCategory(categoryName: string) {
  return SUBCATEGORIES[categoryName] ?? [];
}

// Helper to find a subcategory by slug across all categories
export function getSubcategoryBySlug(slug: string) {
  for (const subs of Object.values(SUBCATEGORIES)) {
    const found = subs.find((s) => s.slug === slug);
    if (found) return found;
  }
  return null;
}

export const ITEMS_PER_PAGE = 12;
export const PLATFORM_FEE_PERCENT = 15;

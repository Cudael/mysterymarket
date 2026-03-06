import { CATEGORY_META, SUBCATEGORIES } from "./constants";
import { getCategoryIcon } from "./categories";
import type { LucideIcon } from "lucide-react";

export interface NavSubcategory {
  name: string;
  slug: string;
}

export interface NavCategory {
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  quickLinks: NavSubcategory[];
}

const QUICK_LINK_COUNT = 4;

export const NAV_CATEGORIES: NavCategory[] = Object.values(CATEGORY_META).map((cat) => ({
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  icon: getCategoryIcon(cat.icon),
  quickLinks: (SUBCATEGORIES[cat.name] ?? []).slice(0, QUICK_LINK_COUNT),
}));

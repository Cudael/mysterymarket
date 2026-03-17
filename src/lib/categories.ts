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
  Link,
  DollarSign,
  GraduationCap,
  Heart,
  Compass,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { CATEGORY_META, SUBCATEGORIES } from "./constants";
import type { CATEGORIES } from "./constants";

export type CategoryName = (typeof CATEGORIES)[number];

export interface SubcategoryInfo {
  name: string;
  slug: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export type SubcategoriesMap = typeof SUBCATEGORIES;

export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
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
  Link,
  DollarSign,
  GraduationCap,
  Heart,
  Compass,
  Sparkles,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return CATEGORY_ICON_MAP[iconName] ?? Sparkles;
}

// Navigation-ready category interfaces
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

export const NAV_CATEGORIES: NavCategory[] = Object.values(CATEGORY_META).map((cat) => ({
  name: cat.name,
  slug: cat.slug,
  description: cat.description,
  icon: getCategoryIcon(cat.icon),
  quickLinks: SUBCATEGORIES[cat.name] ?? [],
}));

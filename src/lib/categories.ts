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
import type { CATEGORIES, SUBCATEGORIES } from "./constants";

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

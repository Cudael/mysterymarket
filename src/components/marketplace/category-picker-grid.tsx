"use client";

import Link from "next/link";
import { Rocket, Code, Bot, TrendingUp, Package, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_CARDS = [
  {
    name: "Startup & Business",
    slug: "startup-business",
    description: "Venture concepts, business models, and entrepreneurial strategies worth protecting.",
    icon: Rocket,
    accent: "from-violet-500/20 to-violet-600/10 border-violet-500/20 hover:border-violet-500/40",
    iconColor: "text-violet-400",
    glow: "hover:shadow-[0_4px_24px_rgba(139,92,246,0.18)]",
  },
  {
    name: "Software & Tech",
    slug: "software-tech",
    description: "Apps, tools, developer utilities, and technical concepts ready to be built.",
    icon: Code,
    accent: "from-cyan-500/20 to-blue-600/10 border-cyan-500/20 hover:border-cyan-500/40",
    iconColor: "text-cyan-400",
    glow: "hover:shadow-[0_4px_24px_rgba(34,211,238,0.18)]",
  },
  {
    name: "AI & Automation",
    slug: "ai-automation",
    description: "Prompts, workflows, agents, and AI-native product ideas ahead of the curve.",
    icon: Bot,
    accent: "from-fuchsia-500/20 to-purple-600/10 border-fuchsia-500/20 hover:border-fuchsia-500/40",
    iconColor: "text-fuchsia-400",
    glow: "hover:shadow-[0_4px_24px_rgba(232,121,249,0.18)]",
  },
  {
    name: "Marketing & Growth",
    slug: "marketing-growth",
    description: "Growth playbooks, campaign frameworks, and monetization strategies that actually work.",
    icon: TrendingUp,
    accent: "from-emerald-500/20 to-teal-600/10 border-emerald-500/20 hover:border-emerald-500/40",
    iconColor: "text-emerald-400",
    glow: "hover:shadow-[0_4px_24px_rgba(52,211,153,0.18)]",
  },
  {
    name: "Product & Design",
    slug: "product-design",
    description: "UX concepts, product specs, branding directions, and invention blueprints.",
    icon: Package,
    accent: "from-amber-500/20 to-orange-600/10 border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
    glow: "hover:shadow-[0_4px_24px_rgba(251,191,36,0.18)]",
  },
  {
    name: "Creative & Content",
    slug: "creative-content",
    description: "Writing formats, creator strategies, content systems, and artistic concepts.",
    icon: PenTool,
    accent: "from-rose-500/20 to-pink-600/10 border-rose-500/20 hover:border-rose-500/40",
    iconColor: "text-rose-400",
    glow: "hover:shadow-[0_4px_24px_rgba(251,113,133,0.18)]",
  },
];

export function CategoryPickerGrid() {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/30">
        Browse by category
      </p>
      {/* Horizontal scrollable row on mobile; grid on md+ */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-6">
        {CATEGORY_CARDS.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/ideas/category/${cat.slug}`}
              className={cn(
                "group relative flex shrink-0 items-center gap-2.5 rounded-xl border bg-gradient-to-br px-3.5 py-2.5 transition-all duration-200 hover:-translate-y-[1px]",
                "md:flex-col md:items-start md:gap-2 md:rounded-2xl md:p-4",
                cat.accent,
                cat.glow
              )}
            >
              {/* Icon */}
              <div className={cn("shrink-0 transition-transform duration-200 group-hover:scale-110", cat.iconColor)}>
                <Icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              {/* Label */}
              <span className="whitespace-nowrap text-[13px] font-semibold text-white/80 group-hover:text-white md:whitespace-normal md:text-[13px] md:leading-snug">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

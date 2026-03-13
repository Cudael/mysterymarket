"use client";

import Link from "next/link";
import { Rocket, Code, Bot, TrendingUp, Package, PenTool, ArrowRight } from "lucide-react";

const CATEGORY_CARDS = [
  {
    name: "Startup & Business",
    slug: "startup-business",
    description: "Venture concepts, business models, and entrepreneurial strategies worth protecting.",
    icon: Rocket,
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    name: "Software & Tech",
    slug: "software-tech",
    description: "Apps, tools, developer utilities, and technical concepts ready to be built.",
    icon: Code,
    gradient: "from-blue-600 to-cyan-700",
  },
  {
    name: "AI & Automation",
    slug: "ai-automation",
    description: "Prompts, workflows, agents, and AI-native product ideas ahead of the curve.",
    icon: Bot,
    gradient: "from-purple-600 to-fuchsia-700",
  },
  {
    name: "Marketing & Growth",
    slug: "marketing-growth",
    description: "Growth playbooks, campaign frameworks, and monetization strategies that actually work.",
    icon: TrendingUp,
    gradient: "from-emerald-600 to-teal-700",
  },
  {
    name: "Product & Design",
    slug: "product-design",
    description: "UX concepts, product specs, branding directions, and invention blueprints.",
    icon: Package,
    gradient: "from-orange-500 to-amber-600",
  },
  {
    name: "Creative & Content",
    slug: "creative-content",
    description: "Writing formats, creator strategies, content systems, and artistic concepts.",
    icon: PenTool,
    gradient: "from-rose-500 to-pink-600",
  },
];

export function CategoryPickerGrid() {
  return (
    <div>
      <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Browse by category
      </p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {CATEGORY_CARDS.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/ideas/category/${cat.slug}`}
              className={`group relative flex h-[160px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
            >
              {/* Subtle radial highlight overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />

              <div className="relative">
                <Icon className="h-8 w-8 text-white/90" />
              </div>

              <div className="relative">
                <p className="text-[17px] font-bold text-white">{cat.name}</p>
                <p className="mt-1 line-clamp-1 text-[12px] text-white/70">{cat.description}</p>
              </div>

              {/* Arrow hint */}
              <ArrowRight className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white/70" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { ElementType } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  subLabel?: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, subLabel, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-border bg-card p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
          {label}
        </p>
        <Icon className="h-4 w-4 text-foreground/70 shrink-0" />
      </div>
      <div className="mt-5">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {subLabel && (
          <p className="mt-0.5 text-[12px] font-medium text-foreground/40">{subLabel}</p>
        )}
      </div>
    </div>
  );
}

interface InlineStatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  className?: string;
}

export function InlineStatCard({ label, value, icon: Icon, className }: InlineStatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[12px] border border-border bg-card p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-muted border border-border">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-[13px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-[28px] font-bold tracking-tight text-foreground">{value}</p>
      </div>
    </div>
  );
}

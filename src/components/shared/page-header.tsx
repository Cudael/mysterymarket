import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, icon, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 border-b border-border pb-6",
        (action || icon) && "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("flex items-center gap-3.5", !icon && "block")}>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-primary shadow-[var(--shadow-primary-glow)]">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-2 text-[15px] leading-[1.6] text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

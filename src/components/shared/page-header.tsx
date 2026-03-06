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
        "mb-8 border-b border-[#D9DCE3] pb-6",
        (action || icon) && "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("flex items-center gap-3.5", !icon && "block")}>
        {icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#3A5FCD] shadow-[0_2px_8px_rgba(58,95,205,0.3)]">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">{title}</h1>
          {description && (
            <p className="mt-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

interface ContentCardProps {
  title?: string;
  titleIcon?: ElementType;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export function ContentCard({
  title,
  titleIcon: TitleIcon,
  action,
  children,
  className,
  headerClassName,
  bodyClassName,
}: ContentCardProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden",
        className
      )}
    >
      {title && (
        <div
          className={cn(
            "border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4",
            (TitleIcon || action) && "flex items-center gap-2",
            action && "justify-between",
            headerClassName
          )}
        >
          <div className="flex items-center gap-2">
            {TitleIcon && <TitleIcon className="h-4 w-4 text-[#1A1A1A]/40 shrink-0" />}
            <h2 className="text-[15px] font-semibold text-[#1A1A1A]">{title}</h2>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={cn("p-6", bodyClassName)}>{children}</div>
    </div>
  );
}

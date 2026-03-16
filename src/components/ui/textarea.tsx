import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-[8px] border border-border bg-muted/50 px-4 py-3 text-[15px] font-medium text-foreground shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200 placeholder:text-foreground/40 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

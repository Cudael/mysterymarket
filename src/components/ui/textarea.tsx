import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3 text-[15px] font-medium text-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200 placeholder:text-[#1A1A1A]/40 focus:border-[#3A5FCD] focus:bg-[#FFFFFF] focus:ring-2 focus:ring-[#3A5FCD]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
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

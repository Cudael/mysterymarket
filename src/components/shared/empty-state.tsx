import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted border border-border">
        {icon}
      </div>
      <h2 className="text-[20px] font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-[15px] text-muted-foreground max-w-md">{description}</p>
      {action && (
        <Button
          asChild
          className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 px-6 shadow-[var(--shadow-primary-glow)] transition-all"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

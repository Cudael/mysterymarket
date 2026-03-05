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
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F9FC] border border-[#D9DCE3]">
        {icon}
      </div>
      <h2 className="text-[20px] font-semibold text-[#1A1A1A]">{title}</h2>
      <p className="mt-3 text-[15px] text-[#1A1A1A]/60 max-w-md">{description}</p>
      {action && (
        <Button
          asChild
          className="mt-8 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white font-medium h-11 px-6 shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all"
        >
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

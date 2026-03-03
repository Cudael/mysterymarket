import type { Metadata } from "next";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Purchase Cancelled - MysteryMarket",
};

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-6 py-24 flex items-center justify-center min-h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-[440px] rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F0] border border-[#FFEAEA] shadow-sm mb-6">
          <XCircle className="h-8 w-8 text-[#D32F2F]" />
        </div>
        
        <h1 className="text-[24px] font-bold tracking-tight text-[#1A1A1A]">
          Purchase Cancelled
        </h1>
        
        <p className="mt-3 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          Your checkout process was safely cancelled. No charges were made to your account.
        </p>
        
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild className="w-full bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white font-medium h-11 shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all">
            <Link href="/ideas">Continue Browsing</Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-11 border-[#D9DCE3] bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F8F9FC] transition-colors">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4 text-[#1A1A1A]/50" />
              Back to Home
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}

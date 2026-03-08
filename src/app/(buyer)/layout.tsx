import { Navbar } from "@/components/layout/navbar";
import { BuyerSubNav } from "@/components/layout/buyer-sub-nav";
import { BuyerSidebar } from "@/components/layout/buyer-sidebar";

export const dynamic = "force-dynamic";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F6FA] text-[#1A1A1A] antialiased selection:bg-[#3A5FCD] selection:text-white">
      <Navbar />
      {/* Mobile: horizontal sub-nav */}
      <div className="md:hidden">
        <BuyerSubNav />
      </div>
      {/* Desktop: sidebar flush-left + content */}
      <div className="flex flex-1">
        <BuyerSidebar />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8 lg:py-10">
          <div className="mx-auto w-full max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

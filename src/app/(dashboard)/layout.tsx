import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F6FA] text-[#1A1A1A] font-sans antialiased selection:bg-[#3A5FCD] selection:text-white">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6 md:p-10 lg:p-12">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

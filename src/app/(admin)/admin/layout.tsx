import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { requireAdmin } from "@/features/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background text-foreground font-sans antialiased selection:bg-red-500 selection:text-white">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6 md:p-10 lg:p-12">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

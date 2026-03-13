import { Navbar } from "@/components/layout/navbar";

export const dynamic = "force-dynamic";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-surface text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  );
}

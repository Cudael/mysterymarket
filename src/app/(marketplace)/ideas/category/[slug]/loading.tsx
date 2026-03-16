import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero Skeleton */}
      <section className="bg-muted border-b border-border">
        <div className="container mx-auto px-6 lg:px-8 max-w-[1400px] py-12 md:py-16">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-3 w-3 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          <div className="flex items-center gap-5">
            <Skeleton className="h-14 w-14 rounded-[12px] shrink-0" />
            <div>
              <Skeleton className="h-9 w-64 rounded-[8px]" />
              <Skeleton className="mt-2 h-5 w-96 max-w-full rounded-[6px]" />
            </div>
          </div>

          <Skeleton className="mt-5 h-5 w-32 rounded-[6px]" />
        </div>
      </section>

      <div className="container mx-auto px-6 lg:px-8 max-w-[1400px] py-12">
        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-[380px] rounded-[12px] bg-card border border-border shadow-[0_4px_14px_rgba(0,0,0,0.02)] p-5 flex flex-col"
            >
              <Skeleton className="h-40 w-full rounded-[8px]" />
              <Skeleton className="mt-5 h-6 w-3/4 rounded-[4px]" />
              <Skeleton className="mt-3 h-4 w-full rounded-[4px]" />
              <Skeleton className="mt-2 h-4 w-5/6 rounded-[4px]" />
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-[4px]" />
                </div>
                <Skeleton className="h-8 w-16 rounded-[6px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function IdeasLoading() {
  return (
    <div className="bg-surface min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        
        {/* Header Skeleton */}
        <div className="mb-8 pb-6 border-b border-border">
          <Skeleton className="h-10 w-64 md:w-96 bg-border/50 rounded-[8px]" />
          <Skeleton className="mt-4 h-5 w-48 md:w-72 bg-border/50 rounded-[6px]" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-10">
          <Skeleton className="h-12 w-full max-w-2xl bg-border/50 rounded-[10px]" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[380px] rounded-[12px] bg-card border border-border shadow-[0_4px_14px_rgba(0,0,0,0.02)] p-5 flex flex-col">
              <Skeleton className="h-40 w-full rounded-[8px] bg-muted" />
              <Skeleton className="mt-5 h-6 w-3/4 bg-muted rounded-[4px]" />
              <Skeleton className="mt-3 h-4 w-full bg-muted rounded-[4px]" />
              <Skeleton className="mt-2 h-4 w-5/6 bg-muted rounded-[4px]" />
              
              <div className="mt-auto pt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full bg-muted" />
                  <Skeleton className="h-4 w-24 bg-muted rounded-[4px]" />
                </div>
                <Skeleton className="h-8 w-16 bg-muted rounded-[6px]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

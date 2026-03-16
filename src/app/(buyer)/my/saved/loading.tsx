import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-12 w-full max-w-[480px] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[16px] border border-border bg-card"
          >
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="space-y-4 p-5">
              <Skeleton className="h-5 w-3/4 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3 rounded-lg" />
              <div className="flex items-center justify-between border-t border-border pt-4">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

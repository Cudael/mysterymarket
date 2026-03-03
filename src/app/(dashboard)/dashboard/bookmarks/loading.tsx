import { Skeleton } from "@/components/ui/skeleton";

export default function BookmarksLoading() {
  return (
    <div className="mx-auto max-w-5xl pb-12">
      <div className="mb-8 border-b border-[#D9DCE3] pb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-5 w-80" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
          >
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="flex flex-1 flex-col p-6 gap-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="mt-auto pt-5 border-t border-[#D9DCE3] flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

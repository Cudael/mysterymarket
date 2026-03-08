import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-12 w-full max-w-[420px] rounded-xl" />
      </div>

      <div className="rounded-[16px] border border-[#D9DCE3] bg-[#FFFFFF] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#D9DCE3] px-6 py-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 border-b border-[#D9DCE3] p-5 last:border-b-0"
          >
            <Skeleton className="h-10 w-10 shrink-0 rounded-[10px]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

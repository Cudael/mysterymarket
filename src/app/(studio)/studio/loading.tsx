import { Skeleton } from "@/components/ui/skeleton";

export default function CreatorLoading() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-40 rounded-full" />
        <Skeleton className="h-12 w-full max-w-[520px] rounded-xl" />
      </div>

      <Skeleton className="h-[220px] w-full rounded-[16px]" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[16px]" />
        ))}
      </div>

      <Skeleton className="h-[180px] w-full rounded-[16px]" />

      <Skeleton className="h-[380px] w-full rounded-[16px]" />
    </div>
  );
}

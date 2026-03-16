import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-3xl pb-12 space-y-8">
      
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-72" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="rounded-[12px] border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted px-6 py-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-[8px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full rounded-[8px]" />
          </div>
          <div className="flex justify-end pt-2">
            <Skeleton className="h-10 w-32 rounded-[8px]" />
          </div>
        </div>
      </div>

      {/* Account Info Card Skeleton */}
      <div className="rounded-[12px] border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted px-6 py-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-20 rounded-[6px]" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Connect Card Skeleton */}
      <div className="rounded-[12px] border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-muted px-6 py-4">
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32 rounded-[8px]" />
        </div>
      </div>

    </div>
  );
}

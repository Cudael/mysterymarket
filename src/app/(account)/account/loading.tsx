import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-3xl pb-12 space-y-8">
      
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-40 bg-[#D9DCE3]/50" />
        <Skeleton className="h-5 w-72 bg-[#D9DCE3]/30" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
          <Skeleton className="h-6 w-32 bg-[#D9DCE3]/60" />
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-[#D9DCE3]/50" />
            <Skeleton className="h-10 w-full rounded-[8px] bg-[#F5F6FA]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16 bg-[#D9DCE3]/50" />
            <Skeleton className="h-24 w-full rounded-[8px] bg-[#F5F6FA]" />
          </div>
          <div className="flex justify-end pt-2">
            <Skeleton className="h-10 w-32 rounded-[8px] bg-[#3A5FCD]/20" />
          </div>
        </div>
      </div>

      {/* Account Info Card Skeleton */}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
          <Skeleton className="h-6 w-40 bg-[#D9DCE3]/60" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 bg-[#D9DCE3]/40" />
              <Skeleton className="h-5 w-48 bg-[#D9DCE3]/60" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-24 bg-[#D9DCE3]/40" />
              <Skeleton className="h-7 w-20 rounded-[6px] bg-[#D9DCE3]/40" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-3.5 w-24 bg-[#D9DCE3]/40" />
              <Skeleton className="h-5 w-36 bg-[#D9DCE3]/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Connect Card Skeleton */}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
          <Skeleton className="h-6 w-36 bg-[#D9DCE3]/60" />
        </div>
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 bg-[#D9DCE3]/50" />
            <Skeleton className="h-4 w-64 bg-[#D9DCE3]/30" />
          </div>
          <Skeleton className="h-10 w-32 rounded-[8px] bg-[#D9DCE3]/40" />
        </div>
      </div>

    </div>
  );
}

"use client";

import { formatPrice } from "@/lib/utils";

interface CategoryBreakdownProps {
  data: Array<{ category: string; count: number; totalSpent: number }>;
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  if (data.length === 0) {
    return (
      <p className="text-[14px] text-[#1A1A1A]/40 py-4">
        No purchase data yet.
      </p>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <div key={item.category} className="flex items-center gap-3">
          <span className="w-[120px] shrink-0 text-[13px] font-medium text-[#1A1A1A] truncate">
            {item.category}
          </span>
          <div className="flex-1 h-2 rounded-full bg-[#F5F6FA] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3A5FCD]"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <div className="shrink-0 text-right min-w-[100px]">
            <span className="text-[13px] font-semibold text-[#1A1A1A]">
              {item.count} {item.count === 1 ? "idea" : "ideas"}
            </span>
            <span className="text-[12px] text-[#1A1A1A]/50 ml-2">
              {formatPrice(item.totalSpent)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

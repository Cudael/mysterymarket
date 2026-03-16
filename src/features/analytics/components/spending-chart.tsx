"use client";

import { formatPrice } from "@/lib/utils";

interface SpendingChartProps {
  data: Array<{ month: string; amount: number }>;
}

export function SpendingChart({ data }: SpendingChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  const hasData = data.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <p className="flex h-full items-center justify-center text-[14px] text-muted-foreground">
        No spending data yet. Start discovering ideas!
      </p>
    );
  }

  return (
    <div className="h-full flex items-end gap-1.5">
      {data.map((point) => (
        <div
          key={point.month}
          className="flex flex-1 flex-col items-center gap-1"
        >
          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
            {point.amount > 0 ? formatPrice(point.amount) : ""}
          </span>
          <div
            className="w-full rounded-t-[4px] bg-primary transition-all hover:bg-primary/80"
            style={{
              height: `${(point.amount / maxAmount) * 100}%`,
              minHeight: point.amount > 0 ? "4px" : "0px",
            }}
            title={`${point.month}: ${formatPrice(point.amount)}`}
          />
          <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">
            {point.month}
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface RevenueDataPoint {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No revenue data yet. Start selling ideas!
          </p>
        ) : (
          <div className="flex items-end gap-2 h-48">
            {data.map((point) => (
              <div
                key={point.month}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-xs text-muted-foreground">
                  {point.revenue > 0 ? formatPrice(point.revenue) : ""}
                </span>
                <div
                  className="w-full rounded-t-md bg-primary transition-all hover:bg-primary/80"
                  style={{
                    height: `${(point.revenue / maxRevenue) * 100}%`,
                    minHeight: point.revenue > 0 ? "4px" : "0px",
                  }}
                  title={`${point.month}: ${formatPrice(point.revenue)}`}
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {point.month}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

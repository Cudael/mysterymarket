import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface RecentSale {
  id: string;
  buyerName: string | null;
  ideaTitle: string;
  amount: number;
  platformFee: number;
  date: Date;
}

interface RecentSalesProps {
  sales: RecentSale[];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function RecentSales({ sales }: RecentSalesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Recent Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No sales yet.
          </p>
        ) : (
          <div className="space-y-4">
            {sales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {sale.ideaTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {sale.buyerName || "Anonymous"} • {timeAgo(sale.date)}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-green-600">
                    +{formatPrice(sale.amount - sale.platformFee)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fee: {formatPrice(sale.platformFee)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

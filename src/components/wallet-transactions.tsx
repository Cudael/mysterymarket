import { ArrowUpRight, ArrowDownLeft, RotateCcw, ArrowDownCircle, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

type WalletTransactionType = "EARNING" | "WITHDRAWAL" | "REFUND_DEBIT" | "DEPOSIT" | "PURCHASE";

interface Transaction {
  id: string;
  type: WalletTransactionType;
  amountInCents: number;
  description: string;
  createdAt: Date;
}

interface WalletTransactionsProps {
  transactions: Transaction[];
}

const TYPE_CONFIG: Record<
  WalletTransactionType,
  { icon: React.ElementType; label: string; color: string; sign: "+" | "-" }
> = {
  EARNING: {
    icon: ArrowUpRight,
    label: "Earning",
    color: "text-green-600",
    sign: "+",
  },
  WITHDRAWAL: {
    icon: ArrowDownLeft,
    label: "Withdrawal",
    color: "text-blue-600",
    sign: "-",
  },
  REFUND_DEBIT: {
    icon: RotateCcw,
    label: "Refund",
    color: "text-red-600",
    sign: "-",
  },
  DEPOSIT: {
    icon: ArrowDownCircle,
    label: "Deposit",
    color: "text-green-600",
    sign: "+",
  },
  PURCHASE: {
    icon: ShoppingCart,
    label: "Purchase",
    color: "text-red-600",
    sign: "-",
  },
};

function relativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 6) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function WalletTransactions({ transactions }: WalletTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No transactions yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {transactions.map((tx) => {
              const config = TYPE_CONFIG[tx.type];
              const Icon = config.icon;
              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ${config.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {tx.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {relativeTime(tx.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${config.color}`}
                    >
                      {config.sign}
                      {formatPrice(tx.amountInCents)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {config.label}
                    </Badge>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

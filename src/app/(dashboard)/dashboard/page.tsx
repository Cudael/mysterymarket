import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPurchasesByUser } from "@/actions/purchases";
import { getRefundRequestsForUser } from "@/actions/refunds";
import { RefundDialog } from "@/components/refund-dialog";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Purchases - MysteryIdea",
};

export default async function DashboardPage() {
  let purchases: Awaited<ReturnType<typeof getPurchasesByUser>> = [];
  let refundRequests: Awaited<ReturnType<typeof getRefundRequestsForUser>> = [];
  try {
    [purchases, refundRequests] = await Promise.all([
      getPurchasesByUser(),
      getRefundRequestsForUser(),
    ]);
  } catch {
    // User not authenticated or not found — show empty state
  }

  const refundByPurchaseId = new Map(
    refundRequests.map((r) => [r.purchaseId, r.status as "PENDING" | "APPROVED" | "DENIED"])
  );

  const totalSpent = purchases.reduce((sum, p) => sum + p.amountInCents, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">My Purchases</h1>
      <p className="mt-2 text-muted-foreground">
        Ideas you have unlocked will appear here.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Purchases</p>
            <p className="text-2xl font-bold text-foreground">
              {purchases.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-foreground">
              {formatPrice(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {purchases.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            No purchases yet
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse ideas to get started!
          </p>
          <Button asChild className="mt-6">
            <Link href="/ideas">Browse Ideas</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:shadow-primary/10"
            >
              <Link
                href={`/ideas/${purchase.idea.id}`}
                className="group flex flex-col flex-1"
              >
                <h3 className="line-clamp-2 font-semibold text-foreground group-hover:text-primary">
                  {purchase.idea.title}
                </h3>
                {purchase.idea.teaserText && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {purchase.idea.teaserText}
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      by {purchase.idea.creator.name ?? "Anonymous"}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(purchase.amountInCents)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Purchased{" "}
                    {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
              <div className="mt-3 pt-3 border-t border-border">
                <RefundDialog
                  purchaseId={purchase.id}
                  existingStatus={refundByPurchaseId.get(purchase.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

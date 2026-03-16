import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, Clock, ExternalLink } from "lucide-react";
import { getRefundRequests } from "@/features/admin/actions";
import { RefundActions } from "@/features/admin/components/refund-actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Refunds - Admin - MysteryMarket",
};

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "DENIED", label: "Denied" },
];

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  APPROVED: "bg-green-500/10 text-green-400 border-green-500/20",
  DENIED: "bg-red-500/10 text-red-400 border-red-500/20",
};

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export default async function AdminRefundsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status ?? "ALL";
  const refunds = await getRefundRequests(activeStatus);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-green-500/10 border border-green-500/20">
          <DollarSign className="h-5 w-5 text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Refunds
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Manage refund requests from buyers. Review and respond within 3 business days.
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={
              tab.value === "ALL"
                ? "/admin/refunds"
                : `/admin/refunds?status=${tab.value}`
            }
            className={`rounded-[8px] px-4 py-2 text-sm font-medium transition-colors ${
              activeStatus === tab.value
                ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {refunds.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-border bg-card p-16 text-center">
          <DollarSign className="mx-auto h-10 w-10 text-border" />
          <p className="mt-4 text-[16px] text-muted-foreground">
            No refund requests found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Idea & Creator
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Age
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {refunds.map((refund) => {
                  const age = daysSince(refund.createdAt);
                  const overdue = refund.status === "PENDING" && age >= 3;
                  return (
                    <tr
                      key={refund.id}
                      className={`transition-colors hover:bg-muted/50 ${overdue ? "bg-yellow-500/5" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {refund.purchase.buyer.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {refund.purchase.buyer.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-foreground truncate">
                            {refund.purchase.idea.title}
                          </p>
                          <Link
                            href={`/ideas/${refund.purchase.idea.id}`}
                            className="text-primary hover:text-primary/80 shrink-0"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          by{" "}
                          {refund.purchase.idea.creator.name ??
                            refund.purchase.idea.creator.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-primary">
                        {formatPrice(refund.purchase.amountInCents)}
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <p
                          className="text-xs text-muted-foreground line-clamp-3"
                          title={refund.reason}
                        >
                          {refund.reason}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
                            STATUS_BADGE[refund.status] ?? ""
                          }`}
                        >
                          {refund.status.charAt(0) +
                            refund.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 text-xs ${overdue ? "text-yellow-400 font-medium" : "text-muted-foreground"}`}>
                          {overdue && <Clock className="h-3.5 w-3.5" />}
                          <span>
                            {age === 0 ? "Today" : `${age}d ago`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RefundActions
                          refundId={refund.id}
                          currentStatus={refund.status}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Clock } from "lucide-react";
import { adminGetWithdrawals } from "@/features/admin/actions";
import { WithdrawalActions } from "@/features/admin/components/withdrawal-actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Withdrawals - Admin - IdeaVex",
};

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "FAILED", label: "Failed" },
];

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-400 border-green-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
};

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export default async function AdminWithdrawalsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status ?? "ALL";
  const withdrawals = await adminGetWithdrawals(activeStatus);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-blue-500/10 border border-blue-500/20">
          <Banknote className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Withdrawals
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Review and approve or reject creator withdrawal requests. Approved withdrawals trigger a Stripe transfer.
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
                ? "/admin/withdrawals"
                : `/admin/withdrawals?status=${tab.value}`
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

      {withdrawals.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-border bg-card p-16 text-center">
          <Banknote className="mx-auto h-10 w-10 text-border" />
          <p className="mt-4 text-[16px] text-muted-foreground">
            No withdrawal requests found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Stripe Account ID
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
                {withdrawals.map((withdrawal) => {
                  const age = daysSince(withdrawal.createdAt);
                  const user = withdrawal.wallet.user;
                  return (
                    <tr
                      key={withdrawal.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {user.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-primary">
                        {formatPrice(withdrawal.amountInCents)}
                      </td>
                      <td className="px-6 py-4">
                        {user.stripeAccountId ? (
                          <span className="font-mono text-xs text-muted-foreground">
                            {user.stripeAccountId}
                          </span>
                        ) : (
                          <span className="text-xs text-red-400">Not connected</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
                            STATUS_BADGE[withdrawal.status] ?? ""
                          }`}
                        >
                          {withdrawal.status.charAt(0) +
                            withdrawal.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {age === 0 ? "Today" : `${age}d ago`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <WithdrawalActions
                          withdrawalId={withdrawal.id}
                          currentStatus={withdrawal.status}
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

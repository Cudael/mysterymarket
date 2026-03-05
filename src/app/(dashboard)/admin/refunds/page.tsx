import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign } from "lucide-react";
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
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  DENIED: "bg-red-50 text-red-700 border-red-200",
};

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
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-green-50 border border-green-200">
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Refunds
          </h1>
          <p className="mt-1 text-[15px] text-[#1A1A1A]/60">
            Manage refund requests from buyers.
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
                ? "bg-[#3A5FCD] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                : "bg-[#FFFFFF] border border-[#D9DCE3] text-[#1A1A1A]/70 hover:bg-[#F5F6FA]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {refunds.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] p-16 text-center">
          <DollarSign className="mx-auto h-10 w-10 text-[#D9DCE3]" />
          <p className="mt-4 text-[16px] text-[#1A1A1A]/60">
            No refund requests found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#D9DCE3] bg-[#F8F9FC]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Buyer
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Idea
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-[#1A1A1A]/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DCE3]">
                {refunds.map((refund) => (
                  <tr
                    key={refund.id}
                    className="transition-colors hover:bg-[#F5F6FA]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1A1A1A]">
                        {refund.purchase.buyer.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-[#1A1A1A]/50">
                        {refund.purchase.buyer.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1A1A1A]">
                        {refund.purchase.idea.title}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#3A5FCD]">
                      {formatPrice(refund.purchase.amountInCents)}
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className="max-w-[180px] truncate text-xs text-[#1A1A1A]/70"
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
                    <td className="px-6 py-4 text-xs text-[#1A1A1A]/50">
                      {new Date(refund.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RefundActions
                        refundId={refund.id}
                        currentStatus={refund.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

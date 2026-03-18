"use client";

import { useState } from "react";
import { toast } from "sonner";
import { adminApproveWithdrawal, adminRejectWithdrawal } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";

export function WithdrawalActions({
  withdrawalId,
  currentStatus,
}: {
  withdrawalId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  if (currentStatus !== "PENDING") return null;

  async function handleApprove() {
    setLoading(true);
    try {
      await adminApproveWithdrawal(withdrawalId);
      toast.success("Withdrawal approved and Stripe transfer initiated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      await adminRejectWithdrawal(withdrawalId);
      toast.success("Withdrawal rejected and funds returned to creator");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={handleReject}
        className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
      >
        Reject
      </Button>
      <Button
        size="sm"
        disabled={loading}
        onClick={handleApprove}
        className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
      >
        Approve
      </Button>
    </div>
  );
}

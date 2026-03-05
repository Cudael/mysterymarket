"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateRefundStatus } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";

export function RefundActions({
  refundId,
  currentStatus,
}: {
  refundId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  if (currentStatus !== "PENDING") return null;

  async function handleAction(status: "APPROVED" | "DENIED") {
    setLoading(true);
    try {
      await updateRefundStatus(refundId, status);
      toast.success(status === "APPROVED" ? "Refund approved" : "Refund denied");
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
        onClick={() => handleAction("DENIED")}
        className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
      >
        Deny
      </Button>
      <Button
        size="sm"
        disabled={loading}
        onClick={() => handleAction("APPROVED")}
        className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
      >
        Approve
      </Button>
    </div>
  );
}

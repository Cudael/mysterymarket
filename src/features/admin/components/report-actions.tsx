"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ReportStatus } from "@prisma/client";
import { updateReportStatus } from "@/features/admin/actions";
import { Button } from "@/components/ui/button";

export function ReportActions({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: ReportStatus;
}) {
  const [loading, setLoading] = useState(false);

  if (currentStatus !== "PENDING") return null;

  async function handleAction(status: ReportStatus, unpublishIdea = false) {
    setLoading(true);
    try {
      await updateReportStatus(reportId, status, { unpublishIdea });
      toast.success(
        status === "DISMISSED"
          ? "Report dismissed"
          : status === "REVIEWED"
          ? "Report marked as reviewed"
          : "Action taken — idea unpublished"
      );
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
        onClick={() => handleAction("DISMISSED")}
        className="h-8 text-xs border-[#D9DCE3]"
      >
        Dismiss
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={loading}
        onClick={() => handleAction("REVIEWED")}
        className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
      >
        Mark Reviewed
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={loading}
        onClick={() => handleAction("ACTION_TAKEN", true)}
        className="h-8 text-xs"
      >
        Take Action
      </Button>
    </div>
  );
}

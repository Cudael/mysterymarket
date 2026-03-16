import { ReportStatus } from "@prisma/client";

const STATUS_STYLES: Record<ReportStatus, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  REVIEWED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DISMISSED: "bg-muted text-muted-foreground border-border",
  ACTION_TAKEN: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  DISMISSED: "Dismissed",
  ACTION_TAKEN: "Action Taken",
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

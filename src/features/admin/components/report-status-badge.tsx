import { ReportStatus } from "@prisma/client";

const STATUS_STYLES: Record<ReportStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  REVIEWED: "bg-blue-50 text-blue-700 border-blue-200",
  DISMISSED: "bg-[#F5F6FA] text-[#1A1A1A]/60 border-[#D9DCE3]",
  ACTION_TAKEN: "bg-red-50 text-red-700 border-red-200",
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

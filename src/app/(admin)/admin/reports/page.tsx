import type { Metadata } from "next";
import Link from "next/link";
import { Flag, ExternalLink } from "lucide-react";
import { getReports } from "@/features/admin/actions";
import { ReportStatusBadge } from "@/features/admin/components/report-status-badge";
import { ReportActions } from "@/features/admin/components/report-actions";

export const metadata: Metadata = {
  title: "Reports - Admin - MysteryMarket",
};

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "REVIEWED", label: "Reviewed" },
  { value: "DISMISSED", label: "Dismissed" },
  { value: "ACTION_TAKEN", label: "Action Taken" },
];

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status ?? "ALL";
  const reports = await getReports(activeStatus);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-orange-50 border border-orange-200">
          <Flag className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Reports
          </h1>
          <p className="mt-1 text-[15px] text-[#1A1A1A]/60">
            Manage content reports from users.
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
                ? "/admin/reports"
                : `/admin/reports?status=${tab.value}`
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

      {reports.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] p-16 text-center">
          <Flag className="mx-auto h-10 w-10 text-[#D9DCE3]" />
          <p className="mt-4 text-[16px] text-[#1A1A1A]/60">No reports found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#D9DCE3] bg-[#F8F9FC]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Reporter
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Idea
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
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="transition-colors hover:bg-[#F5F6FA]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1A1A1A]">
                        {report.reporter.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-[#1A1A1A]/50">
                        {report.reporter.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-[#1A1A1A]">
                            {report.idea.title}
                          </p>
                          <p className="text-xs text-[#1A1A1A]/50">
                            by{" "}
                            {report.idea.creator.name ??
                              report.idea.creator.email}
                          </p>
                        </div>
                        <Link
                          href={`/ideas/${report.idea.id}`}
                          className="text-[#3A5FCD] hover:text-[#6D7BE0]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                      {report.details && (
                        <p
                          className="mt-1 text-xs text-[#1A1A1A]/60 max-w-[200px] truncate"
                          title={report.details}
                        >
                          {report.details}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-[6px] border border-[#D9DCE3] bg-[#F5F6FA] px-2.5 py-1 text-xs font-medium text-[#1A1A1A]">
                        {report.reason.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ReportStatusBadge status={report.status} />
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A]/50 text-xs">
                      {new Date(report.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReportActions
                        reportId={report.id}
                        currentStatus={report.status}
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

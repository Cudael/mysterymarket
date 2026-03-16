import type { Metadata } from "next";
import Link from "next/link";
import { Flag, ExternalLink, Clock } from "lucide-react";
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

const REASON_TABS = [
  { value: "ALL", label: "All Reasons" },
  { value: "MISLEADING", label: "Misleading" },
  { value: "INAPPROPRIATE", label: "Inappropriate" },
  { value: "SPAM", label: "Spam" },
  { value: "PLAGIARISM", label: "Plagiarism" },
  { value: "OTHER", label: "Other" },
];

const REASON_COLORS: Record<string, string> = {
  MISLEADING: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  INAPPROPRIATE: "bg-red-500/10 text-red-400 border-red-500/20",
  SPAM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  PLAGIARISM: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  OTHER: "bg-muted text-muted-foreground border-border",
};

function daysSince(date: Date): number {
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; reason?: string }>;
}) {
  const { status, reason } = await searchParams;
  const activeStatus = status ?? "ALL";
  const activeReason = reason ?? "ALL";
  const reports = await getReports(activeStatus, activeReason);

  function buildHref(newStatus: string, newReason: string) {
    const params = new URLSearchParams();
    if (newStatus !== "ALL") params.set("status", newStatus);
    if (newReason !== "ALL") params.set("reason", newReason);
    const qs = params.toString();
    return `/admin/reports${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-orange-500/10 border border-orange-500/20">
          <Flag className="h-5 w-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reports
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Manage content reports from users.
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mb-3 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={buildHref(tab.value, activeReason)}
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

      {/* Reason filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {REASON_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={buildHref(activeStatus, tab.value)}
            className={`rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors ${
              activeReason === tab.value
                ? "bg-foreground text-background"
                : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-border bg-card p-16 text-center">
          <Flag className="mx-auto h-10 w-10 text-border" />
          <p className="mt-4 text-[16px] text-muted-foreground">No reports found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Reporter
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Idea & Creator
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Reason / Details
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
                {reports.map((report) => {
                  const age = daysSince(report.createdAt);
                  const urgent = report.status === "PENDING" && age >= 3;
                  return (
                    <tr
                      key={report.id}
                      className={`transition-colors hover:bg-muted/50 ${urgent ? "bg-orange-500/5" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">
                          {report.reporter.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {report.reporter.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 max-w-[220px]">
                        <div className="flex items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-foreground truncate">
                                {report.idea.title}
                              </p>
                              <Link
                                href={`/ideas/${report.idea.id}`}
                                className="text-primary hover:text-primary/80 shrink-0"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              by{" "}
                              {report.idea.creator.name ?? report.idea.creator.email}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span
                                className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                  report.idea.published
                                    ? "bg-green-500/10 text-green-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {report.idea.published ? "Live" : "Unpublished"}
                              </span>
                              {(report.idea._count.reports > 1) && (
                                <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400">
                                  {report.idea._count.reports} reports
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <span
                          className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
                            REASON_COLORS[report.reason] ?? REASON_COLORS.OTHER
                          }`}
                        >
                          {report.reason.replace(/_/g, " ")}
                        </span>
                        {report.details && (
                          <p
                            className="mt-1.5 text-xs text-muted-foreground line-clamp-2"
                            title={report.details}
                          >
                            {report.details}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <ReportStatusBadge status={report.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 text-xs ${urgent ? "text-orange-400 font-medium" : "text-muted-foreground"}`}>
                          {urgent && <Clock className="h-3.5 w-3.5" />}
                          <span>
                            {age === 0 ? "Today" : `${age}d ago`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ReportActions
                          reportId={report.id}
                          currentStatus={report.status}
                          ideaPublished={report.idea.published}
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

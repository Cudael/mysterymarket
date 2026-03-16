import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb, ExternalLink } from "lucide-react";
import { getAdminIdeas } from "@/features/admin/actions";
import { IdeaPublishToggle } from "@/features/admin/components/idea-publish-toggle";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ideas - Admin - MysteryMarket",
};

function getPageWindow(current: number, total: number): (number | null)[] {
  if (total <= 9) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | null)[] = [1];
  if (current > 4) pages.push(null);
  for (let p = Math.max(2, current - 2); p <= Math.min(total - 1, current + 2); p++) pages.push(p);
  if (current < total - 3) pages.push(null);
  pages.push(total);
  return pages;
}

const STATUS_TABS = [
  { value: "ALL", label: "All" },
  { value: "published", label: "Published" },
  { value: "unpublished", label: "Unpublished" },
];

export default async function AdminIdeasPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const { search, status, page } = await searchParams;
  const activeStatus = status ?? "ALL";
  const currentPage = page ? parseInt(page, 10) : 1;
  const { ideas, total, pageSize } = await getAdminIdeas(
    search,
    activeStatus,
    currentPage
  );

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-primary/10 border border-primary/20">
          <Lightbulb className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Ideas
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {total.toLocaleString()} total idea{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form className="flex-1">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by title..."
            className="w-full max-w-sm rounded-[8px] border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {status && <input type="hidden" name="status" value={status} />}
        </form>
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (tab.value !== "ALL") params.set("status", tab.value);
            const href = `/admin/ideas${params.toString() ? `?${params.toString()}` : ""}`;
            return (
              <Link
                key={tab.value}
                href={href}
                className={`rounded-[8px] px-4 py-2 text-sm font-medium transition-colors ${
                  activeStatus === tab.value
                    ? "bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-border bg-card p-16 text-center">
          <Lightbulb className="mx-auto h-10 w-10 text-border" />
          <p className="mt-4 text-[16px] text-muted-foreground">No ideas found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Purchases
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Reports
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ideas.map((idea) => (
                  <tr
                    key={idea.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {idea.title}
                        </p>
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-muted-foreground">
                        {idea.creator.name ?? idea.creator.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      {formatPrice(idea.priceInCents)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
                          idea.published
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {idea.published ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {idea._count.purchases}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          idea._count.reports > 0
                            ? "font-semibold text-red-400"
                            : "text-muted-foreground"
                        }
                      >
                        {idea._count.reports}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(idea.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <IdeaPublishToggle
                        ideaId={idea.id}
                        published={idea.published}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {getPageWindow(currentPage, totalPages).map((p, i) => {
            if (p === null) {
              return <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">…</span>;
            }
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (activeStatus !== "ALL") params.set("status", activeStatus);
            if (p > 1) params.set("page", p.toString());
            return (
              <Link
                key={p}
                href={`/admin/ideas${params.toString() ? `?${params.toString()}` : ""}`}
                className={`flex h-9 w-9 items-center justify-center rounded-[8px] text-sm font-medium transition-colors ${
                  currentPage === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#3A5FCD]/10 border border-[#3A5FCD]/20">
          <Lightbulb className="h-5 w-5 text-[#3A5FCD]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Ideas
          </h1>
          <p className="mt-1 text-[15px] text-[#1A1A1A]/60">
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
            className="w-full max-w-sm rounded-[8px] border border-[#D9DCE3] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:border-[#3A5FCD] focus:outline-none focus:ring-1 focus:ring-[#3A5FCD]"
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
                    ? "bg-[#3A5FCD] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)]"
                    : "bg-[#FFFFFF] border border-[#D9DCE3] text-[#1A1A1A]/70 hover:bg-[#F5F6FA]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {ideas.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] p-16 text-center">
          <Lightbulb className="mx-auto h-10 w-10 text-[#D9DCE3]" />
          <p className="mt-4 text-[16px] text-[#1A1A1A]/60">No ideas found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#D9DCE3] bg-[#F8F9FC]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Purchases
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Reports
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
                {ideas.map((idea) => (
                  <tr
                    key={idea.id}
                    className="transition-colors hover:bg-[#F5F6FA]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-[#1A1A1A]">
                          {idea.title}
                        </p>
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="text-[#3A5FCD] hover:text-[#6D7BE0]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#1A1A1A]/70">
                        {idea.creator.name ?? idea.creator.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-[#3A5FCD]">
                      {formatPrice(idea.priceInCents)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-medium ${
                          idea.published
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-[#F5F6FA] text-[#1A1A1A]/60 border-[#D9DCE3]"
                        }`}
                      >
                        {idea.published ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A]/70">
                      {idea._count.purchases}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          idea._count.reports > 0
                            ? "font-semibold text-red-600"
                            : "text-[#1A1A1A]/70"
                        }
                      >
                        {idea._count.reports}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#1A1A1A]/50">
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
              return <span key={`ellipsis-${i}`} className="px-1 text-[#1A1A1A]/40">…</span>;
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
                    ? "bg-[#3A5FCD] text-white"
                    : "bg-[#FFFFFF] border border-[#D9DCE3] text-[#1A1A1A]/70 hover:bg-[#F5F6FA]"
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

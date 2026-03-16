import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { getUsers } from "@/features/admin/actions";
import { UserRoleSelect } from "@/features/admin/components/user-role-select";

export const metadata: Metadata = {
  title: "Users - Admin - MysteryMarket",
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

const ROLE_TABS = [
  { value: "ALL", label: "All" },
  { value: "USER", label: "Users" },
  { value: "CREATOR", label: "Creators" },
  { value: "ADMIN", label: "Admins" },
];

const ROLE_BADGE: Record<string, string> = {
  USER: "bg-muted text-muted-foreground border-border",
  CREATOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ADMIN: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; page?: string }>;
}) {
  const { search, role, page } = await searchParams;
  const activeRole = role ?? "ALL";
  const currentPage = page ? parseInt(page, 10) : 1;
  const { users, total, pageSize } = await getUsers(search, activeRole, currentPage);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-blue-500/10 border border-blue-500/20">
          <Users className="h-5 w-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Users
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {total.toLocaleString()} total user{total !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form className="flex-1">
          <input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email..."
            className="w-full max-w-sm rounded-[8px] border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {role && <input type="hidden" name="role" value={role} />}
        </form>
        <div className="flex flex-wrap gap-2">
          {ROLE_TABS.map((tab) => {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (tab.value !== "ALL") params.set("role", tab.value);
            const href = `/admin/users${params.toString() ? `?${params.toString()}` : ""}`;
            return (
              <Link
                key={tab.value}
                href={href}
                className={`rounded-[8px] px-4 py-2 text-sm font-medium transition-colors ${
                  activeRole === tab.value
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

      {users.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-border bg-card p-16 text-center">
          <Users className="mx-auto h-10 w-10 text-border" />
          <p className="mt-4 text-[16px] text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Ideas
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Purchases
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-muted-foreground">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-muted-foreground">
                    Change Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {user.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-[6px] border px-2.5 py-1 text-xs font-bold uppercase ${
                          ROLE_BADGE[user.role] ?? ""
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user._count.ideas}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user._count.purchases}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
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
            if (activeRole !== "ALL") params.set("role", activeRole);
            if (p > 1) params.set("page", p.toString());
            return (
              <Link
                key={p}
                href={`/admin/users${params.toString() ? `?${params.toString()}` : ""}`}
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

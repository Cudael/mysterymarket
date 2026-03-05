import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { getUsers } from "@/features/admin/actions";
import { UserRoleSelect } from "@/features/admin/components/user-role-select";

export const metadata: Metadata = {
  title: "Users - Admin - MysteryMarket",
};

const ROLE_TABS = [
  { value: "ALL", label: "All" },
  { value: "USER", label: "Users" },
  { value: "CREATOR", label: "Creators" },
  { value: "ADMIN", label: "Admins" },
];

const ROLE_BADGE: Record<string, string> = {
  USER: "bg-[#F5F6FA] text-[#1A1A1A]/60 border-[#D9DCE3]",
  CREATOR: "bg-blue-50 text-blue-700 border-blue-200",
  ADMIN: "bg-red-50 text-red-700 border-red-200",
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
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-blue-50 border border-blue-200">
          <Users className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Users
          </h1>
          <p className="mt-1 text-[15px] text-[#1A1A1A]/60">
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
            className="w-full max-w-sm rounded-[8px] border border-[#D9DCE3] bg-[#FFFFFF] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:border-[#3A5FCD] focus:outline-none focus:ring-1 focus:ring-[#3A5FCD]"
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

      {users.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#FFFFFF] p-16 text-center">
          <Users className="mx-auto h-10 w-10 text-[#D9DCE3]" />
          <p className="mt-4 text-[16px] text-[#1A1A1A]/60">No users found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#D9DCE3] bg-[#F8F9FC]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    User
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Ideas
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Purchases
                  </th>
                  <th className="px-6 py-4 text-left font-semibold text-[#1A1A1A]/70">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-[#1A1A1A]/70">
                    Change Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9DCE3]">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-[#F5F6FA]"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1A1A1A]">
                        {user.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-[#1A1A1A]/50">{user.email}</p>
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
                    <td className="px-6 py-4 text-[#1A1A1A]/70">
                      {user._count.ideas}
                    </td>
                    <td className="px-6 py-4 text-[#1A1A1A]/70">
                      {user._count.purchases}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#1A1A1A]/50">
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
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

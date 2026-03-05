"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateUserRole } from "@/features/admin/actions";
import { Role } from "@prisma/client";

export function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<Role>(currentRole);

  async function handleChange(newRole: Role) {
    if (newRole === role) return;
    if (!confirm(`Change this user's role to ${newRole}?`)) return;

    setLoading(true);
    try {
      await updateUserRole(userId, newRole);
      setRole(newRole);
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value as Role)}
      disabled={loading}
      className="rounded-[8px] border border-[#D9DCE3] bg-[#FFFFFF] px-3 py-1.5 text-xs font-medium text-[#1A1A1A] focus:border-[#3A5FCD] focus:outline-none focus:ring-1 focus:ring-[#3A5FCD] disabled:opacity-50"
    >
      <option value="USER">USER</option>
      <option value="CREATOR">CREATOR</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}

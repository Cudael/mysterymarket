import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Lightbulb,
  DollarSign,
  Flag,
  TrendingUp,
  BarChart3,
  Shield,
  AlertCircle,
} from "lucide-react";
import { getPlatformStats } from "@/features/admin/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard - MysteryMarket",
};

export default async function AdminPage() {
  const stats = await getPlatformStats();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-red-500/10 border border-red-500/20">
          <Shield className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[15px] text-[#1A1A1A]/60">
            Platform overview and key metrics.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {(stats.pendingReports > 0 || stats.pendingRefunds > 0) && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          {stats.pendingReports > 0 && (
            <Link
              href="/admin/reports"
              className="flex items-center gap-3 rounded-[12px] border border-orange-200 bg-orange-50 p-4 text-orange-800 transition-colors hover:bg-orange-100 flex-1"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-orange-500" />
              <span className="text-sm font-medium">
                {stats.pendingReports} pending report
                {stats.pendingReports !== 1 ? "s" : ""} need review
              </span>
            </Link>
          )}
          {stats.pendingRefunds > 0 && (
            <Link
              href="/admin/refunds"
              className="flex items-center gap-3 rounded-[12px] border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 transition-colors hover:bg-yellow-100 flex-1"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-yellow-500" />
              <span className="text-sm font-medium">
                {stats.pendingRefunds} pending refund
                {stats.pendingRefunds !== 1 ? "s" : ""} need attention
              </span>
            </Link>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          label="Total Creators"
          value={stats.totalCreators.toLocaleString()}
          icon={TrendingUp}
          href="/admin/users?role=CREATOR"
        />
        <StatCard
          label="Total Ideas"
          value={stats.totalIdeas.toLocaleString()}
          icon={Lightbulb}
          href="/admin/ideas"
        />
        <StatCard
          label="Published Ideas"
          value={stats.publishedIdeas.toLocaleString()}
          icon={Lightbulb}
          href="/admin/ideas?status=published"
          accent
        />
        <StatCard
          label="Total Purchases"
          value={stats.totalPurchases.toLocaleString()}
          icon={BarChart3}
          href="/admin/refunds"
        />
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={DollarSign}
          href="/admin/refunds"
          accent
        />
        <StatCard
          label="Platform Fees"
          value={formatPrice(stats.platformFeesEarned)}
          icon={DollarSign}
          href="/admin/refunds"
        />
        <StatCard
          label="Pending Reports"
          value={stats.pendingReports.toLocaleString()}
          icon={Flag}
          href="/admin/reports"
          danger={stats.pendingReports > 0}
        />
      </div>

      {/* Recent Activity */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Purchases */}
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[15px] font-semibold text-[#1A1A1A]">
              Recent Purchases
            </h2>
          </div>
          {stats.recentPurchases.length === 0 ? (
            <p className="p-6 text-sm text-[#1A1A1A]/50">No purchases yet.</p>
          ) : (
            <div className="divide-y divide-[#D9DCE3]">
              {stats.recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1A1A1A]">
                      {purchase.idea.title}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/50">
                      {purchase.buyer.name ?? purchase.buyer.email}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-sm font-semibold text-[#3A5FCD]">
                      {formatPrice(purchase.amountInCents)}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/50">
                      {new Date(purchase.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-[#D9DCE3] bg-[#F8F9FC] px-6 py-4">
            <h2 className="text-[15px] font-semibold text-[#1A1A1A]">
              Recent Signups
            </h2>
          </div>
          {stats.recentUsers.length === 0 ? (
            <p className="p-6 text-sm text-[#1A1A1A]/50">No users yet.</p>
          ) : (
            <div className="divide-y divide-[#D9DCE3]">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#1A1A1A]">
                      {user.name ?? "Anonymous"}
                    </p>
                    <p className="truncate text-xs text-[#1A1A1A]/50">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-700"
                          : user.role === "CREATOR"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-[#F5F6FA] text-[#1A1A1A]/60"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="mt-0.5 text-xs text-[#1A1A1A]/50">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  accent,
  danger,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  href: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-[12px] border p-6 shadow-[0_4px_14px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 ${
        danger
          ? "border-red-200 bg-red-50 hover:border-red-300"
          : accent
          ? "border-[#3A5FCD]/20 bg-[#3A5FCD]/5 hover:border-[#3A5FCD]/30"
          : "border-[#D9DCE3] bg-[#FFFFFF] hover:border-[#3A5FCD]/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            danger ? "text-red-600" : "text-[#1A1A1A]/60"
          }`}
        >
          {label}
        </span>
        <Icon
          className={`h-4 w-4 ${
            danger
              ? "text-red-400"
              : accent
              ? "text-[#3A5FCD]"
              : "text-[#1A1A1A]/30"
          }`}
        />
      </div>
      <p
        className={`mt-4 text-3xl font-bold ${
          danger ? "text-red-700" : "text-[#1A1A1A]"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}

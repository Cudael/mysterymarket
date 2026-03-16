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
  RefreshCw,
  ShoppingCart,
  Repeat2,
  Tag,
} from "lucide-react";
import { getPlatformStats } from "@/features/admin/actions";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Dashboard - MysteryMarket",
};

export default async function AdminPage() {
  const stats = await getPlatformStats();

  const highRefundRate = stats.refundRate >= 10;
  const staleReports = stats.pendingReports > 5;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-red-500/10 border border-red-500/20">
          <Shield className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            Platform overview and key operational metrics.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {(stats.pendingReports > 0 || stats.pendingRefunds > 0 || highRefundRate) && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row flex-wrap">
          {stats.pendingReports > 0 && (
            <Link
              href="/admin/reports?status=PENDING"
              className={`flex items-center gap-3 rounded-[12px] border p-4 transition-colors flex-1 min-w-[200px] ${
                staleReports
                  ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15"
                  : "border-orange-500/20 bg-orange-500/10 text-orange-400 hover:bg-orange-500/15"
              }`}
            >
              <AlertCircle className={`h-5 w-5 shrink-0 ${staleReports ? "text-red-500" : "text-orange-500"}`} />
              <span className="text-sm font-medium">
                {stats.pendingReports} pending report
                {stats.pendingReports !== 1 ? "s" : ""} need review
                {staleReports ? " — high volume" : ""}
              </span>
            </Link>
          )}
          {stats.pendingRefunds > 0 && (
            <Link
              href="/admin/refunds?status=PENDING"
              className="flex items-center gap-3 rounded-[12px] border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-400 transition-colors hover:bg-yellow-500/15 flex-1 min-w-[200px]"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-yellow-500" />
              <span className="text-sm font-medium">
                {stats.pendingRefunds} pending refund
                {stats.pendingRefunds !== 1 ? "s" : ""} need attention
              </span>
            </Link>
          )}
          {highRefundRate && (
            <div className="flex items-center gap-3 rounded-[12px] border border-red-500/20 bg-red-500/10 p-4 text-red-400 flex-1 min-w-[200px]">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <span className="text-sm font-medium">
                Elevated refund rate: {stats.refundRate}% — review idea quality
              </span>
            </div>
          )}
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          href="/admin/users"
        />
        <StatCard
          label="Active Creators"
          value={stats.activeCreatorCount.toLocaleString()}
          icon={TrendingUp}
          href="/admin/users?role=CREATOR"
          accent
        />
        <StatCard
          label="Published Ideas"
          value={stats.publishedIdeas.toLocaleString()}
          icon={Lightbulb}
          href="/admin/ideas?status=published"
          accent
        />
        <StatCard
          label="Total Ideas"
          value={stats.totalIdeas.toLocaleString()}
          icon={Lightbulb}
          href="/admin/ideas"
        />
        <StatCard
          label="GMV (All Time)"
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
          label="Sales (Last 30d)"
          value={stats.recentPurchasesCount.toLocaleString()}
          icon={ShoppingCart}
          href="/admin/refunds"
          accent
        />
        <StatCard
          label="Total Purchases"
          value={stats.totalPurchases.toLocaleString()}
          icon={BarChart3}
          href="/admin/refunds"
        />
        <StatCard
          label="Repeat Buyers"
          value={stats.repeatBuyerCount.toLocaleString()}
          icon={Repeat2}
          href="/admin/users"
        />
        <StatCard
          label="Refund Rate"
          value={`${stats.refundRate}%`}
          icon={RefreshCw}
          href="/admin/refunds"
          danger={highRefundRate}
        />
        <StatCard
          label="Pending Reports"
          value={stats.pendingReports.toLocaleString()}
          icon={Flag}
          href="/admin/reports?status=PENDING"
          danger={stats.pendingReports > 0}
        />
        <StatCard
          label="Pending Refunds"
          value={stats.pendingRefunds.toLocaleString()}
          icon={RefreshCw}
          href="/admin/refunds?status=PENDING"
          danger={stats.pendingRefunds > 0}
        />
      </div>

      {/* Top Categories + Recent Activity */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Top Categories */}
        <div className="rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-foreground/40" />
            <h2 className="text-[15px] font-semibold text-foreground">
              Top Categories
            </h2>
          </div>
          {stats.topCategories.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No category data yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {stats.topCategories.map((cat, i) => (
                <div
                  key={cat.category}
                  className="flex items-center justify-between px-6 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-foreground/30 w-4">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground capitalize">
                      {cat.category}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {cat.count} purchase{cat.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-[15px] font-semibold text-foreground">
              Recent Purchases
            </h2>
          </div>
          {stats.recentPurchases.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No purchases yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {stats.recentPurchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {purchase.idea.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {purchase.buyer.name ?? purchase.buyer.email}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(purchase.amountInCents)}
                    </p>
                    <p className="text-xs text-muted-foreground">
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
        <div className="rounded-[12px] border border-border bg-card shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-[15px] font-semibold text-foreground">
              Recent Signups
            </h2>
          </div>
          {stats.recentUsers.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {user.name ?? "Anonymous"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        user.role === "ADMIN"
                          ? "bg-red-500/10 text-red-400"
                          : user.role === "CREATOR"
                          ? "bg-blue-500/10 text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="mt-0.5 text-xs text-muted-foreground">
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
          ? "border-red-500/20 bg-red-500/10 hover:border-red-500/30"
          : accent
          ? "border-primary/20 bg-primary/5 hover:border-primary/30"
          : "border-border bg-card hover:border-primary/20"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            danger ? "text-red-400" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        <Icon
          className={`h-4 w-4 ${
            danger
              ? "text-red-400"
              : accent
              ? "text-primary"
              : "text-foreground/30"
          }`}
        />
      </div>
      <p
        className={`mt-4 text-3xl font-bold ${
          danger ? "text-red-400" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}

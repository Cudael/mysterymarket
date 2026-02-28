import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { BarChart3, Star, DollarSign, ShoppingCart, Lightbulb, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/revenue-chart";
import { TopIdeasTable } from "@/components/top-ideas-table";
import { RecentSales } from "@/components/recent-sales";
import { PayoutInfo } from "@/components/payout-info";
import { getCreatorAnalytics } from "@/actions/analytics";
import { getConnectAccountStatus } from "@/actions/stripe-connect";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics - MysteryIdea",
};

export default async function CreatorAnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [analytics, connectStatus] = await Promise.all([
    getCreatorAnalytics(),
    getConnectAccountStatus(),
  ]);

  const { stats, revenueByMonth, topIdeas, recentSales } = analytics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-7 w-7 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Creator Analytics</h1>
          <p className="text-sm text-muted-foreground">Your performance at a glance</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total Revenue
              <DollarSign className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">Net earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total Sales
              <ShoppingCart className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalSales}</p>
            <p className="text-xs text-muted-foreground">Completed purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Avg Rating
              <Star className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Overall quality</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total Reviews
              <MessageSquare className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalReviews}</p>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Active Ideas
              <Lightbulb className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.activeIdeas}</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total Ideas
              <Lightbulb className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalIdeas}</p>
            <p className="text-xs text-muted-foreground">All ideas</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={revenueByMonth} />

      {/* Top Ideas + Recent Sales */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopIdeasTable ideas={topIdeas} />
        <RecentSales sales={recentSales} />
      </div>

      {/* Payout Info */}
      <PayoutInfo
        connected={connectStatus.connected}
        onboarded={connectStatus.onboarded}
      />
    </div>
  );
}

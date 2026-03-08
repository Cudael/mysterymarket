import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getNotifications,
  markAllRead,
} from "@/features/notifications/actions";
import { NotificationsClient } from "@/features/notifications/components/notifications-client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/shared/dashboard-card";
import type { Notification } from "@prisma/client";

export const metadata: Metadata = {
  title: "Notifications - MysteryMarket",
};

export default async function NotificationsPage() {
  let notifications: Notification[] = [];
  let unreadCount = 0;

  try {
    const result = await getNotifications(50);
    notifications = result.notifications;
    unreadCount = result.unreadCount;
  } catch {
    // User not authenticated or not found
  }

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notifications" },
        ]}
      />

      <PageHeader
        title="Notifications"
        description="Stay up to date with activity across your account."
        icon={<Bell className="h-6 w-6 text-white" />}
        action={
          unreadCount > 0 ? (
            <form
              action={async () => {
                "use server";
                await markAllRead();
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="border-[#D9DCE3] text-[#3A5FCD] hover:bg-[#3A5FCD]/5"
              >
                Mark all as read
              </Button>
            </form>
          ) : undefined
        }
      />

      <DashboardCard
        title="Inbox"
        bodyClassName="p-0"
        action={
          unreadCount > 0 ? (
            <span className="rounded-full bg-[#3A5FCD]/10 px-2.5 py-1 text-[12px] font-medium text-[#3A5FCD]">
              {unreadCount} unread
            </span>
          ) : (
            <span className="rounded-full bg-[#F5F6FA] px-2.5 py-1 text-[12px] font-medium text-[#1A1A1A]/50">
              All caught up
            </span>
          )
        }
      >
        <NotificationsClient
          initialNotifications={notifications}
          initialUnreadCount={unreadCount}
        />
      </DashboardCard>
    </div>
  );
}

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  getNotifications,
  markAllRead,
} from "@/features/notifications/actions";
import { NotificationsClient } from "@/features/notifications/components/notifications-client";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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
    <div className="mx-auto max-w-3xl pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/dashboard" },
          { label: "Notifications" },
        ]}
      />
      <div className="mb-8 flex items-center justify-between border-b border-[#D9DCE3] pb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">
            Notifications
          </h1>
          <p className="mt-2 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
            Stay up to date with activity on your account.
          </p>
        </div>
        {unreadCount > 0 && (
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
        )}
      </div>

      <NotificationsClient
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
      />
    </div>
  );
}

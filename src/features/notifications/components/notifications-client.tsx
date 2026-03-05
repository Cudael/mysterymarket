"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ShoppingBag,
  Star,
  DollarSign,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { markAsRead, markAllRead } from "@/features/notifications/actions";
import type { Notification, NotificationType } from "@prisma/client";
import { cn } from "@/lib/utils";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "PURCHASE":
    case "SALE":
      return ShoppingBag;
    case "REVIEW":
      return Star;
    case "REFUND":
      return DollarSign;
    case "BOOKMARK":
      return Bookmark;
    case "SYSTEM":
    default:
      return Bell;
  }
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface NotificationsClientProps {
  initialNotifications: Notification[];
  initialUnreadCount: number;
}

export function NotificationsClient({
  initialNotifications,
  initialUnreadCount,
}: NotificationsClientProps) {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPending, startTransition] = useTransition();

  const handleMarkAllRead = () => {
    startTransition(async () => {
      try {
        await markAllRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      } catch {
        toast.error("Failed to mark notifications as read");
      }
    });
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, read: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // ignore error
      }
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[#D9DCE3] bg-[#F8F9FC] p-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#D9DCE3]">
            <Bell className="h-7 w-7 text-[#1A1A1A]/40" />
          </div>
          <p className="text-[18px] font-semibold text-[#1A1A1A]">
            No notifications yet
          </p>
          <p className="mt-2 text-[15px] text-[#1A1A1A]/60 max-w-md">
            When something happens, you&#39;ll see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="text-[13px] font-medium text-[#3A5FCD] hover:underline disabled:opacity-50"
          >
            Mark all as read
          </button>
        </div>
      )}
      <div className="rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {notifications.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          return (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "w-full text-left flex items-start gap-4 border-b border-[#D9DCE3] last:border-b-0 p-5 transition-colors hover:bg-[#F8F9FC]",
                !notification.read ? "bg-[#F5F6FA]" : "bg-white"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border",
                  !notification.read
                    ? "bg-[#3A5FCD]/10 border-[#3A5FCD]/20"
                    : "bg-[#F5F6FA] border-[#D9DCE3]"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5",
                    !notification.read ? "text-[#3A5FCD]" : "text-[#1A1A1A]/50"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "text-[14px] leading-snug",
                      !notification.read
                        ? "font-semibold text-[#1A1A1A]"
                        : "font-medium text-[#1A1A1A]/80"
                    )}
                  >
                    {notification.title}
                  </p>
                  {!notification.read && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3A5FCD]" />
                  )}
                </div>
                <p className="mt-0.5 text-[13px] text-[#1A1A1A]/60">
                  {notification.message}
                </p>
                <p className="mt-1.5 text-[11px] text-[#1A1A1A]/40">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

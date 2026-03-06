import { logger } from "@/lib/logger";

export type AnalyticsEventName =
  | "idea_viewed"
  | "idea_bookmarked"
  | "checkout_started"
  | "unlock_initiated"
  | "purchase_completed"
  | "review_submitted"
  | "report_submitted"
  | "refund_requested"
  | "refund_resolved"
  | "creator_idea_published"
  | "creator_idea_created";

export type AnalyticsEventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}) {
  logger.info("analytics.event", {
    event: name,
    ...payload,
  });
}


import { logger } from "@/lib/logger";

export type AnalyticsEventName =
  | "idea_viewed"
  | "idea_bookmarked"
  | "checkout_started"
  | "purchase_completed"
  | "review_submitted"
  | "refund_requested"
  | "creator_idea_published";

export type AnalyticsEventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsEventPayload = {}) {
  logger.info("analytics.event", {
    event: name,
    ...payload,
  });
}


# Core Product Metrics

This document defines the baseline KPIs used in the phased implementation plan.

## 1) Buyer Activation Rate

**Definition:** Percentage of new buyers who complete their first successful unlock within 7 days of account creation.

**Formula:**

`buyers_with_first_purchase_within_7d / new_buyers`

**Why it matters:** Measures whether onboarding and marketplace discovery are converting signups into value.

---

## 2) Purchase Conversion Rate

**Definition:** Percentage of unique idea detail viewers who complete a successful purchase.

**Formula:**

`unique_buyers_with_purchase / unique_idea_viewers`

**Why it matters:** Indicates idea page quality, pricing trust, and checkout effectiveness.

---

## 3) 7-Day Retention (Buyers + Creators)

### Buyer retention
**Definition:** Percentage of buyers who return and perform a meaningful action within 7 days after first purchase.

**Meaningful actions:**
- view another idea
- bookmark an idea
- submit a review
- make another purchase

### Creator retention
**Definition:** Percentage of creators who return and perform a meaningful action within 7 days after first publish.

**Meaningful actions:**
- edit an idea
- publish another idea
- view analytics
- respond to payout/connect setup tasks

**Why it matters:** Retention is the strongest signal that the marketplace is delivering repeat value.

---

## 4) Average Creator Earnings per Week

**Definition:** Average net earnings per active creator over a trailing 7-day window.

**Formula:**

`sum(creator_net_earnings_7d) / active_creators_7d`

Where:
- `creator_net_earnings_7d = purchase_amount - platform_fee - refunds`
- `active_creators_7d = creators with at least one published idea or one sale in the window`

**Why it matters:** Captures creator-side business health and monetization quality.

---

## Event Mapping (for Phase 0.2)

These events should be available before KPI automation:

- `idea_viewed`
- `idea_bookmarked`
- `checkout_started`
- `purchase_completed`
- `review_submitted`
- `refund_requested`
- `creator_idea_published`

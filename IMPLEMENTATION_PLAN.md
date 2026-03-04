# MysteryMarket Implementation Plan (Phased PR Roadmap)

This roadmap is intentionally structured so you can ship value in small PRs, in the right order, with low regression risk.

---

## Guiding Principles

- Ship **retention-critical** UX before growth experiments.
- Prefer **small, reversible PRs** (1 feature slice each).
- Add instrumentation with each phase so decisions are data-backed.
- Keep schema changes grouped and forward-compatible.

---

## Phase 0 — Foundation Alignment (Prep)

### Goal
Align docs, basic observability, and consistency before feature work.

### PR 0.1 — Docs & Product Baseline
- Update README roadmap to match current real feature set.
- Add this implementation plan to the repo.
- Add a short `docs/metrics.md` with the core KPIs:
  - Buyer activation rate
  - Purchase conversion rate
  - 7-day retention (buyers + creators)
  - Avg creator earnings per week

### PR 0.2 — Tracking Scaffolding
- Add event helper (server/client-safe) for:
  - `idea_viewed`, `idea_bookmarked`, `checkout_started`, `purchase_completed`
  - `review_submitted`, `refund_requested`, `creator_idea_published`
- Wire events in existing actions/pages without changing behavior.

### Exit Criteria
- Product/docs no longer feel out of sync.
- Core events are emitted for all key flows.

---

## Phase 1 — Buyer Core Experience (Retention First)

### Goal
Remove dead ends and make paid users immediately successful.

### PR 1.1 — Complete Purchase History UI
- Replace placeholder in buyer dashboard with real purchase list/cards.
- Include:
  - Purchase date
  - Amount paid
  - Refund status badge
  - CTA: “View unlocked idea”, “Leave review” (if eligible)
- Add empty state with recommended idea links.

### PR 1.2 — Post-Purchase Journey
- On checkout success page, add:
  - “Go to unlocked idea” deep-link
  - “Discover similar ideas” section
- In dashboard, add “Recently unlocked” summary component.

### PR 1.3 — Review Loop Improvements
- Prompt for review after first successful unlock.
- Add “Your reviews” quick section in dashboard.

### Exit Criteria
- No placeholder buyer pages.
- Buyers can always find and re-open purchased content quickly.

---

## Phase 2 — Discovery & Marketplace Quality

### Goal
Increase browse depth and conversion from listing pages.

### PR 2.1 — Better Search & Filters
- Expand search to include:
  - title
  - teaser text
  - tags
  - creator name
- Add filters for price range and rating.

### PR 2.2 — Sorting & Ranking
- Add server-side sort options:
  - trending (recent weighted purchases + bookmarks)
  - best rated
  - newest
- Keep existing sorts (price asc/desc).

### PR 2.3 — Recommendation Rails (v1)
- Idea detail: “Related ideas” (category/tags/price proximity).
- Buyer dashboard: “Because you unlocked X”.

### Exit Criteria
- Users discover relevant ideas in fewer clicks.
- Marketplace pages feel dynamic, not static.

---

## Phase 3 — Trust, Safety, and Platform Quality

### Goal
Increase trust for both buyers and creators.

### PR 3.1 — Trust Signals on UI
- Creator badges:
  - payouts enabled
  - avg rating tier
  - total sales milestone
- Idea-level quality indicators:
  - refund-rate bucket
  - recent rating trend

### PR 3.2 — Moderation Console (Admin)
- Add admin-only report queue page.
- Actions: mark `REVIEWED`, `DISMISSED`, `ACTION_TAKEN`.
- Basic audit log entry per status change.

### PR 3.3 — Public Safety Pages
- Add Trust & Safety page + moderation policy summary.
- Link from footer and report dialogs.

### Exit Criteria
- Abuse/report workflow is operable.
- Buyers can see clear credibility signals.

---

## Phase 4 — Creator Growth & Monetization

### Goal
Help creators publish better ideas and earn more consistently.

### PR 4.1 — Creator Onboarding Checklist
- Checklist in creator dashboard:
  - complete profile
  - connect Stripe
  - publish first idea
  - get first review
- Show completion progress.

### PR 4.2 — Listing Optimization Helpers
- Add pricing guidance in idea form (based on category + historical bands).
- Teaser quality hints (character count + examples).

### PR 4.3 — Creator CRM Lite
- Add follower/bookmarker count trend (if available).
- Notify creator when idea is bookmarked or purchased.

### Exit Criteria
- Creators have clear next actions.
- Creator-side conversion and publishing cadence improve.

---

## Phase 5 — Growth Loops & Content Engine

### Goal
Drive repeat traffic and organic acquisition.

### PR 5.1 — Homepage Live Activity
- Replace static-only social proof with live metrics:
  - unlocks this week
  - creator earnings this month
  - trending categories

### PR 5.2 — Blog & SEO Baseline
- Launch 5 foundational blog posts:
  - buyer guides
  - creator earnings playbooks
- Add internal linking between ideas/creators/blog.

### PR 5.3 — Lifecycle Messaging
- Add notification center + email nudges:
  - wishlist/bookmark updates
  - creator new idea alerts
  - incomplete checkout reminders

### Exit Criteria
- Non-paid acquisition channels are active.
- Returning sessions rise week-over-week.

---

## Recommended PR Execution Order (One-by-One)

1. PR 0.1 — Docs & Product Baseline
2. PR 0.2 — Tracking Scaffolding
3. PR 1.1 — Complete Purchase History UI
4. PR 1.2 — Post-Purchase Journey
5. PR 1.3 — Review Loop Improvements
6. PR 2.1 — Better Search & Filters
7. PR 2.2 — Sorting & Ranking
8. PR 2.3 — Recommendation Rails (v1)
9. PR 3.1 — Trust Signals on UI
10. PR 3.2 — Moderation Console (Admin)
11. PR 3.3 — Public Safety Pages
12. PR 4.1 — Creator Onboarding Checklist
13. PR 4.2 — Listing Optimization Helpers
14. PR 4.3 — Creator CRM Lite
15. PR 5.1 — Homepage Live Activity
16. PR 5.2 — Blog & SEO Baseline
17. PR 5.3 — Lifecycle Messaging

---

## Definition of Done Template (Use Per PR)

Each PR should include:
- Feature scope + non-goals
- Migration notes (if schema changes)
- Screenshots (if UI changes)
- Test checklist (unit/integration/manual)
- Rollout/rollback note
- KPI to monitor after merge

---

## Suggested Milestones

- **Milestone A (Phases 0–1):** Product no longer feels empty for active buyers.
- **Milestone B (Phase 2):** Discovery and conversion quality are measurably improved.
- **Milestone C (Phases 3–4):** Trust and creator-side business health are strong.
- **Milestone D (Phase 5):** Sustainable growth loops are active.


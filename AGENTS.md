# AGENTS.md

## Purpose

This repository contains **IdeaVex**, a Next.js 15 marketplace where creators sell hidden ideas and buyers unlock them for a fee. Agents working here should preserve the existing App Router structure, Prisma data model, and feature-based organization while making the smallest safe change that satisfies the task.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- React 19
- Tailwind CSS + shadcn/ui-style components
- Prisma + PostgreSQL (Neon)
- Clerk authentication
- Stripe Connect
- Uploadthing
- Resend
- Vitest for tests

## Working Directory Map

- `src/app/` - App Router routes, layouts, route groups, API routes, metadata
  - `(marketing)/` — Public marketing pages (landing, about, legal)
  - `(marketplace)/` — Browse/detail pages for ideas, creator profiles, checkout
  - `(buyer)/` — Buyer dashboard (`/my/*`)
  - `(studio)/` — Creator dashboard (`/studio/*`)
  - `(admin)/` — Admin panel (`/admin/*`)
  - `(account)/` — Account settings (`/account/*`)
- `src/features/` - Feature-scoped server actions, components, schemas, and types
  - `analytics/`, `bookmarks/`, `follows/`, `ideas/`, `notifications/`, `purchases/`, `refunds/`, `reports/`, `reviews/`, `stripe/`, `users/`, `wallet/`
- `src/components/` - Shared UI and layout components
- `src/lib/` - Utilities and integrations such as Prisma, Stripe, logger, analytics, email helpers
- `src/hooks/` - Custom React hooks (feature-specific hooks live in their feature module)
- `src/types/` - Shared TypeScript interfaces (feature-specific types live in their feature module)
- `prisma/schema.prisma` - Source of truth for the database schema
- `prisma/migrations/` - Prisma migrations
- `prisma/seed.ts` and `prisma/seed-categories.ts` - Seed scripts
- `docs/` - Supporting product and metrics documentation

## Setup and Common Commands

Install dependencies:

```bash
npm install
```

Run the app locally:

```bash
npm run dev
```

Validate changes:

```bash
npm run lint
npm run test
npm run build
```

Database workflows:

```bash
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:reset
```

## Project Conventions

### Routing and Next.js

- This codebase uses the **App Router** exclusively.
- Dynamic route pages follow the Next.js 15 pattern `params: Promise<{ ... }>` and then `await params`.
- Many pages export `metadata`; preserve or extend metadata when editing route files.
- Keep route-group organization intact: `(marketing)`, `(marketplace)`, `(buyer)`, `(studio)`, `(admin)`, `(account)`.

### Feature Organization

- Prefer adding business logic inside the relevant feature folder under `src/features/<domain>/`.
- Existing mutations are typically implemented as server actions in `src/features/*/actions/index.ts` with `"use server";` at the top.
- Reusable UI belongs in `src/components/`; feature-specific UI should stay close to its feature.

### UI and Styling

- Use TypeScript React components and existing Tailwind utility patterns.
- Reuse shared UI primitives before introducing new base components.
- Prefer the existing `cn()` helper from `src/lib/utils.ts` for class merging.

### Logging and Diagnostics

- Use `logger` from `src/lib/logger.ts` instead of raw `console.log`, `console.warn`, or `console.error`.
- Keep logging structured and minimal, especially around payments, webhooks, and auth.

### Money, Data, and Validation

- Store prices in **cents as integers**.
- Format prices with `formatPrice()` from `src/lib/utils.ts`.
- Prisma schema changes belong in `prisma/schema.prisma` and should be accompanied by the appropriate migration or schema-sync workflow.
- Be careful around Stripe, Clerk, webhook, and email flows; avoid changing external behavior without validating the affected code path.

### Environment and Secrets

- Do not hardcode secrets or callback URLs.
- Use environment variables already documented in `README.md`.
- For database deployments, note that `DATABASE.md` documents pooled and direct Neon connection usage.

## Testing Guidance

- Run targeted validation first when possible, then broader checks if the change touches shared infrastructure.
- Current automated tests are primarily Vitest unit tests under `src/lib/__tests__/`.
- For changes in utilities, sanitization, analytics, or rate limiting, add or update Vitest coverage when practical.
- For route, auth, payment, or webhook changes, include at least a manual verification note if automated coverage is not feasible.

## Change Checklist

Before finishing a task, agents should:

1. Keep edits scoped to the request.
2. Avoid reverting unrelated user changes.
3. Run the most relevant validation commands for the touched area.
4. Update documentation when behavior or workflows change.
5. Call out any env requirements, migration steps, or manual verification needed.

## Notes for Future Agents

- Read `README.md` first for product context and script references.
- Read `DATABASE.md` before changing Prisma connection behavior or migration workflows.
- If a task affects purchases, wallet balances, refunds, or payouts, inspect both the related feature folder and any corresponding webhook/API route before editing.

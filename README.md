# MysteryIdea 💡

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

**MysteryIdea** is a premium idea marketplace where creators post hidden ideas with optional teaser text and images, set their own prices, and buyers unlock ideas for a fee. Revenue is split automatically via Stripe Connect.

---

## Features

- 🔐 **Hidden Ideas** — Post exclusive or multi-unlock ideas behind a paywall
- 💰 **Creator Monetization** — Set your own price; earn to your wallet, withdraw anytime
- 🎭 **Teasers** — Add text/image teasers to spark buyer curiosity
- 🛒 **Instant Unlock** — Buyers unlock ideas instantly after payment
- 📊 **Creator Dashboard** — Track earnings, manage ideas, and monitor unlocks with full analytics
- 💳 **Wallet System** — Built-in wallet with deposits, withdrawals, and transaction history
- ⭐ **Reviews & Ratings** — Buyers can rate and review purchased ideas
- 🔖 **Bookmarks** — Save ideas for later with a personal wishlist
- 🛡️ **Reports & Moderation** — Flag inappropriate content with structured reporting
- 💸 **Refund Requests** — Buyers can request refunds on purchases
- 🔔 **Notifications** — In-app notification center for activity updates
- 🔑 **Auth via Clerk** — Secure sign-in and sign-up flows
- 🖼️ **Image Uploads** — Powered by Uploadthing
- 📧 **Email Notifications** — Transactional emails via Resend

---

## Tech Stack

| Layer        | Technology                     |
|-------------|-------------------------------|
| Framework   | Next.js 15 (App Router)        |
| Language    | TypeScript                     |
| Styling     | Tailwind CSS + shadcn/ui       |
| Auth        | Clerk                          |
| Database    | PostgreSQL (Neon)              |
| ORM         | Prisma                         |
| Payments    | Stripe Connect                 |
| File Upload | Uploadthing                    |
| Email       | Resend                         |

---

## Prerequisites

- Node.js 18+
- PostgreSQL database (e.g., [Neon](https://neon.tech))
- [Clerk](https://clerk.com) account
- [Stripe](https://stripe.com) account with Connect enabled
- [Uploadthing](https://uploadthing.com) account
- [Resend](https://resend.com) account

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/Cudael/mysterymarket.git
cd mysterymarket

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# 4. Run Prisma migrations
npx prisma migrate dev --name init

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sign-in page path (`/sign-in`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sign-up page path (`/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign-in |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign-up |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PLATFORM_FEE_PERCENT` | Platform fee percentage (default: 15) |
| `UPLOADTHING_TOKEN` | Uploadthing API token |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | From address for transactional emails |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g., `http://localhost:3000`) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (optional, enables error monitoring) |
| `SENTRY_ORG` | Sentry organization slug (optional) |
| `SENTRY_PROJECT` | Sentry project slug (optional) |
| `LOG_LEVEL` | Logging verbosity: `debug`, `info`, `warn`, `error` (default: `info` in production) |

---

## Project Structure

```
src/
├── app/
│   ├── (account)/    # Account settings routes
│   ├── (buyer)/      # Buyer dashboard routes (my/*)
│   ├── (marketing)/  # Public marketing pages
│   ├── (marketplace)/# Public marketplace pages
│   ├── (studio)/     # Creator studio routes (studio/*)
│   ├── api/          # API routes (webhooks, uploadthing, health)
│   ├── sign-in/      # Clerk sign-in page
│   └── sign-up/      # Clerk sign-up page
├── components/
│   ├── layout/       # Navbar, footer, hero, sidebars
│   ├── shared/       # Pagination, share buttons, etc.
│   └── ui/           # shadcn/ui base components
├── features/
│   ├── analytics/    # Creator analytics actions
│   ├── bookmarks/    # Bookmark actions & components
│   ├── ideas/        # Idea CRUD actions, schemas & components
│   ├── notifications/# Notification actions & components
│   ├── purchases/    # Purchase actions & components
│   ├── refunds/      # Refund request actions & components
│   ├── reports/      # Report actions & components
│   ├── reviews/      # Review actions & components
│   ├── stripe/       # Stripe Connect actions
│   ├── users/        # User sync & profile actions
│   └── wallet/       # Wallet actions & components
├── hooks/            # Custom React hooks
├── lib/              # Prisma, Stripe, utils, uploadthing, rate-limit, emails
└── content/          # Blog posts and static content
prisma/
├── schema.prisma     # Database schema
├── seed.ts           # Demo data seeding
└── migrations/       # Database migrations
```

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:migrate` | Run Prisma migrations (development) |
| `npm run db:push` | Push schema changes without migrations |
| `npm run db:seed` | Seed the database with demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset the database and re-run migrations |

---

## Database

See [DATABASE.md](./DATABASE.md) for details on connection pooling, Neon PostgreSQL configuration, and running migrations.

---

## Roadmap

- ✅ Auth, ideas CRUD, purchases, Stripe Connect, wallet system
- ✅ Reviews & ratings, reports, refund requests
- ✅ Creator analytics dashboard
- ✅ Bookmarks / Wishlist
- ✅ Notifications center
- 🔜 Category landing pages & advanced search
- 🔜 Admin dashboard & moderation console
- 🔜 Creator profile enhancements
- 🔜 Dark mode

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository and create a feature branch from `main`.
2. Ensure all dependency versions are **exact** (no `^` or `~` carets) in `package.json`.
3. Follow the existing code style (TypeScript strict mode, Tailwind CSS, shadcn/ui).
4. All dynamic route pages must use `params: Promise<{ ... }>` and `await params` (Next.js 15).
5. Use the `logger` utility instead of raw `console.log/error/warn` calls.
6. Store prices in cents as integers; display with `formatPrice()` from `src/lib/utils.ts`.
7. Run `npm run build` and `npm run lint` before submitting a pull request.

---

## License

MIT
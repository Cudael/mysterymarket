# MysteryIdea 💡

**MysteryIdea** is a premium idea marketplace where creators post hidden ideas with optional teaser text and images, set their own prices, and buyers unlock ideas for a fee. Revenue is split automatically via Stripe Connect.

---

## Features

- 🔐 **Hidden Ideas** — Post exclusive or multi-unlock ideas behind a paywall
- 💰 **Creator Monetization** — Set your own price; earn to your wallet, withdraw anytime
- 🎭 **Teasers** — Add text/image teasers to spark buyer curiosity
- 🛒 **Instant Unlock** — Buyers unlock ideas instantly after payment
- 📊 **Creator Dashboard** — Track earnings, manage ideas, and monitor unlocks
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
git clone https://github.com/Cudael/MysteryIdea.git
cd MysteryIdea

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
| `UPLOADTHING_SECRET` | Uploadthing secret |
| `UPLOADTHING_APP_ID` | Uploadthing app ID |
| `RESEND_API_KEY` | Resend API key |
| `NEXT_PUBLIC_APP_URL` | Public app URL (e.g., `http://localhost:3000`) |

---

## Project Structure

```
src/
├── actions/          # Server actions (ideas, purchases, stripe-connect, users)
├── app/
│   ├── (dashboard)/  # Protected dashboard routes
│   ├── (marketing)/  # Public marketing pages
│   ├── (marketplace)/# Public marketplace pages
│   ├── api/          # API routes (webhooks, uploadthing)
│   ├── sign-in/      # Clerk sign-in page
│   └── sign-up/      # Clerk sign-up page
├── components/
│   ├── ui/           # shadcn/ui base components
│   ├── navbar.tsx
│   ├── footer.tsx
│   ├── hero.tsx
│   └── idea-card.tsx
├── hooks/            # Custom React hooks
├── lib/              # Prisma, Stripe, utils, uploadthing
└── types/            # TypeScript type definitions
prisma/
└── schema.prisma     # Database schema
```

---

## Roadmap

- ✅ **Completed foundation:** Auth, ideas CRUD, purchases, wallet, analytics, reviews/reports, bookmarks, creator profiles
- 🚧 **Current execution plan:** Follow phased delivery in `IMPLEMENTATION_PLAN.md`
  - **Phase 0:** Docs + metrics + event instrumentation
  - **Phase 1:** Buyer retention UX (purchase history + post-purchase flow)
  - **Phase 2:** Discovery and recommendation quality
  - **Phase 3:** Trust, safety, and moderation workflows
  - **Phase 4:** Creator growth and monetization optimization
  - **Phase 5:** Growth loops and content engine

See `docs/metrics.md` for KPI definitions used to validate each phase.

---

## License

MIT
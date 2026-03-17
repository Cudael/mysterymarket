# MysteryIdea — Copilot Agent Instructions

## Project Overview
MysteryIdea is a premium idea marketplace built with Next.js 15 (App Router), Prisma, PostgreSQL, Stripe Connect, Clerk Auth, and Uploadthing. Creators post hidden ideas with teaser text, buyers pay to unlock them.

## Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **Auth**: Clerk (@clerk/nextjs)
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Stripe Connect (Express accounts)
- **File Upload**: Uploadthing
- **Styling**: Tailwind CSS + shadcn/ui + Radix UI
- **Email**: Resend
- **Deployment**: Vercel

## Critical Build Rules
1. **Next.js 15 async params**: ALL dynamic route pages MUST use `params: Promise<{ id: string }>` and `await params`
2. **Next.js 15 async searchParams**: ALL pages using searchParams MUST use `searchParams: Promise<...>` and `await searchParams`
3. **No Google Fonts at build time**: Use system font stack, NOT `next/font/google` (Vercel build blocks googleapis.com)
4. **Prisma postinstall**: `package.json` must have `"postinstall": "prisma generate"` script
5. **Pinned versions**: All dependency versions must be exact (no `^` or `~` carets)
6. **Server Actions**: Must use `"use server"` directive; client components must use `"use client"`
7. **Prices in cents**: All prices stored as integers in cents; display with `formatPrice()` from `src/lib/utils.ts`

## Project Structure
- `src/app/(marketing)/` — Public marketing pages (landing, about, legal)
- `src/app/(marketplace)/` — Browse/detail pages for ideas, creator profiles, checkout
- `src/app/(buyer)/` — Buyer dashboard (`/my/*`)
- `src/app/(studio)/` — Creator dashboard (`/studio/*`)
- `src/app/(admin)/` — Admin panel (`/admin/*`)
- `src/app/(account)/` — Account settings (`/account/*`)
- `src/features/` — Feature modules (each with actions/, components/, schemas/)
  - `analytics/`, `bookmarks/`, `follows/`, `ideas/`, `notifications/`, `purchases/`, `refunds/`, `reports/`, `reviews/`, `stripe/`, `users/`, `wallet/`
- `src/components/` — Shared components: `layout/`, `shared/`, `ui/` (shadcn)
- `src/lib/` — Prisma client, Stripe SDK, utilities, rate-limit, email templates
- `src/hooks/` — Custom React hooks
- `src/types/` — Shared TypeScript interfaces
- `prisma/schema.prisma` — Database schema

## Database Models
- **User**: clerkId, email, name, bio, avatarUrl, stripeAccountId, stripeOnboarded, role (USER/CREATOR/ADMIN)
- **Idea**: title, teaserText, teaserImageUrl, hiddenContent, priceInCents, currency, unlockType (EXCLUSIVE/MULTI), category, tags, published
- **Purchase**: buyerId, ideaId, amountInCents, platformFeeInCents, stripePaymentIntentId, status (PENDING/COMPLETED/REFUNDED/FAILED)
- **Review**: rating, comment, buyerId, ideaId (unique per buyer-idea pair)
- **Report**: reason (MISLEADING/INAPPROPRIATE/SPAM/PLAGIARISM/OTHER), details, reporterId, ideaId, status
- **RefundRequest**: purchaseId, reason, status (PENDING/APPROVED/DENIED)
- **Wallet**: userId, balanceInCents, totalEarnedInCents, totalWithdrawnInCents
- **WalletTransaction**: walletId, type (EARNING/WITHDRAWAL/REFUND_DEBIT/DEPOSIT/PURCHASE), amountInCents, description
- **WithdrawalRequest**: walletId, amountInCents, status (PENDING/PROCESSING/COMPLETED/FAILED), stripePayoutId
- **Bookmark**: userId, ideaId (unique per user-idea pair)

## Environment Variables (see .env.example)
DATABASE_URL, CLERK keys, STRIPE keys, UPLOADTHING keys, RESEND key, NEXT_PUBLIC_APP_URL

## Testing
Always run `npm run build` before committing to ensure the project compiles without errors.

# Database Configuration

## Connection Pooling

IdeaVex uses **Neon PostgreSQL** with Prisma ORM.

### For Vercel Serverless

Neon provides built-in connection pooling. To use it:

1. In your Neon dashboard, copy the **pooled connection string** (it uses port `5432` and includes `-pooler` in the hostname)
2. Set `DATABASE_URL` to the pooled connection string in Vercel environment variables
3. Optionally set `DIRECT_URL` to the direct (non-pooled) connection string for migrations

In `prisma/schema.prisma`, you can configure:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Used for migrations
}
```

### Connection Limits

- **Neon Free Tier:** 100 concurrent connections (pooled)
- **Neon Pro:** 10,000 concurrent connections (pooled)
- **Vercel Serverless:** Each function invocation creates a connection; the singleton pattern in `src/lib/prisma.ts` reuses connections within the same instance

### Running Migrations

```bash
# Apply migrations (uses DIRECT_URL if set, otherwise DATABASE_URL)
npx prisma migrate deploy

# Seed demo data
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

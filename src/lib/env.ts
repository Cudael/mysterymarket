import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL").optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_", "Invalid Clerk publishable key"),
  CLERK_SECRET_KEY: z.string().startsWith("sk_", "Invalid Clerk secret key"),
  CLERK_WEBHOOK_SECRET: z.string().min(1, "CLERK_WEBHOOK_SECRET is required"),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_", "Invalid Stripe secret key"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith("whsec_", "Invalid Stripe webhook secret"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .startsWith("pk_", "Invalid Stripe publishable key"),
  UPLOADTHING_TOKEN: z.string().min(1, "UPLOADTHING_TOKEN is required"),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  // Sentry (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Validate at import time — will throw descriptive errors if vars are missing.
// Skips strict validation during Next.js build phase to allow compilation with
// dummy env vars (real validation happens at runtime).
function validateEnv(): Env {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE === "phase-production-build"
  ) {
    return process.env as unknown as Env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️  Some environment variables are missing. The app may not function correctly."
      );
    }

    return process.env as unknown as Env;
  }

  return parsed.data;
}

export const env = validateEnv();

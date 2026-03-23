import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "ufs.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  async redirects() {
    return [
      { source: "/dashboard", destination: "/my", permanent: true },
      { source: "/dashboard/insights", destination: "/my/activity", permanent: true },
      { source: "/dashboard/bookmarks", destination: "/my/saved", permanent: true },
      { source: "/dashboard/wallet", destination: "/my/wallet", permanent: true },
      { source: "/dashboard/notifications", destination: "/my/notifications", permanent: true },
      { source: "/studio", destination: "/creator", permanent: true },
      { source: "/studio/analytics", destination: "/creator/analytics", permanent: true },
      { source: "/studio/wallet", destination: "/creator/wallet", permanent: true },
      { source: "/studio/ideas/new", destination: "/creator/ideas/new", permanent: true },
      { source: "/studio/payouts", destination: "/creator/payouts", permanent: true },
      { source: "/studio/ideas/:id/edit", destination: "/creator/ideas/:id/edit", permanent: true },
      { source: "/settings", destination: "/account", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.clerk.accounts.dev https://clerk.ideavex.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://img.clerk.com https://clerk.ideavex.com https://utfs.io https://ufs.io https://*.stripe.com",
              "font-src 'self' data:",
              "connect-src 'self' https://api.stripe.com https://*.clerk.accounts.dev https://*.clerk.dev https://clerk.ideavex.com https://uploadthing.com https://ufs.io https://utfs.io https://*.sentry.io https://*.ingest.sentry.io",
              "frame-src 'self' https://js.stripe.com https://*.clerk.accounts.dev https://clerk.ideavex.com https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

const sentryOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const finalConfig = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig;

export default finalConfig;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - MysteryIdea",
  description:
    "Learn how MysteryIdea collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 28, 2026
        </p>

        <p className="mt-6 text-muted-foreground leading-relaxed">
          MysteryIdea (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          is committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, share, and safeguard your personal information
          when you use our platform.
        </p>

        {/* 1. Data We Collect */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            1. Data We Collect
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We collect the following categories of information:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Account data</strong> —
              Name, email address, and profile information collected via Clerk
              authentication (Google OAuth or email/password)
            </li>
            <li>
              <strong className="text-foreground">Payment data</strong> —
              Payment method details and transaction history handled by Stripe.
              We do not store raw card numbers on our servers.
            </li>
            <li>
              <strong className="text-foreground">Content data</strong> —
              Ideas, teaser text, images, and other content you submit to the
              platform
            </li>
            <li>
              <strong className="text-foreground">Usage data</strong> —
              Pages visited, actions taken, IP address, browser type, and
              device information collected automatically
            </li>
            <li>
              <strong className="text-foreground">Communications</strong> —
              Emails and messages you send to us or receive from the platform
              via Resend
            </li>
          </ul>
        </section>

        {/* 2. How We Use Your Data */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            2. How We Use Your Data
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We use the information we collect to:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Create and manage your account</li>
            <li>Process payments and payouts via Stripe Connect</li>
            <li>Deliver purchased content to buyers</li>
            <li>Send transactional emails (purchase confirmations, payout notifications)</li>
            <li>Improve the platform and develop new features</li>
            <li>Detect and prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* 3. Third-Party Services */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            3. Third-Party Services
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We use the following third-party services, each with their own
            privacy policies:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Clerk</strong> — Authentication and
              user management. See{" "}
              <a
                href="https://clerk.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline hover:no-underline"
              >
                Clerk Privacy Policy
              </a>
            </li>
            <li>
              <strong className="text-foreground">Stripe</strong> — Payment
              processing and creator payouts. See{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline hover:no-underline"
              >
                Stripe Privacy Policy
              </a>
            </li>
            <li>
              <strong className="text-foreground">Uploadthing</strong> — File
              and image storage for idea content and profile photos
            </li>
            <li>
              <strong className="text-foreground">Resend</strong> — Transactional
              email delivery
            </li>
            <li>
              <strong className="text-foreground">Vercel</strong> — Hosting and
              infrastructure. See{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline hover:no-underline"
              >
                Vercel Privacy Policy
              </a>
            </li>
          </ul>
        </section>

        {/* 4. Data Retention */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            4. Data Retention
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We retain your account data for as long as your account is active.
            If you delete your account, we will remove your personal data within
            30 days, except where we are required by law to retain it (for
            example, financial transaction records required for tax purposes,
            which are retained for 7 years).
          </p>
        </section>

        {/* 5. Your Rights */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            5. Your Rights
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">Access</strong> — Request a
              copy of the personal data we hold about you
            </li>
            <li>
              <strong className="text-foreground">Correction</strong> — Request
              that inaccurate data be corrected
            </li>
            <li>
              <strong className="text-foreground">Deletion</strong> — Request
              deletion of your personal data (&ldquo;right to be
              forgotten&rdquo;)
            </li>
            <li>
              <strong className="text-foreground">Export</strong> — Request a
              machine-readable export of your data
            </li>
            <li>
              <strong className="text-foreground">Opt-out</strong> — Opt out of
              marketing communications at any time
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            To exercise any of these rights, please contact us using the
            information at the bottom of this page.
          </p>
        </section>

        {/* 6. Cookie Policy */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            6. Cookie Policy
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We use cookies and similar tracking technologies to maintain your
            session, remember your preferences, and analyze platform usage. The
            following types of cookies are used:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">Essential cookies</strong> —
              Required for authentication and core platform functionality
            </li>
            <li>
              <strong className="text-foreground">Analytics cookies</strong> —
              Help us understand how users interact with the platform (may be
              disabled)
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            You can control cookies through your browser settings. Disabling
            essential cookies may prevent you from using certain features.
          </p>
        </section>

        {/* 7. Data Security */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            7. Data Security
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We implement industry-standard security measures including HTTPS
            encryption, secure database storage, and limited access controls.
            However, no method of transmission over the internet is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        {/* 8. Changes to This Policy */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            8. Changes to This Policy
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by updating the &ldquo;Last updated&rdquo;
            date at the top of this page. We encourage you to review this Policy
            periodically.
          </p>
        </section>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            If you have questions about this Privacy Policy or wish to exercise
            your rights, please{" "}
            <a
              href="/contact"
              className="text-foreground underline hover:no-underline"
            >
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

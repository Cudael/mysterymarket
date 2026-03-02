import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - MysteryIdea",
  description:
    "Learn how MysteryIdea uses cookies and similar tracking technologies.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 28, 2026
        </p>

        <p className="mt-6 text-muted-foreground leading-relaxed">
          This Cookie Policy explains how MysteryIdea (&ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses cookies and similar
          tracking technologies when you visit our platform. By using
          MysteryIdea, you consent to our use of cookies as described in this
          policy.
        </p>

        {/* 1. What Are Cookies */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            1. What Are Cookies
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Cookies are small text files placed on your device by websites you
            visit. They are widely used to make websites work more efficiently
            and to provide information to website owners. Cookies can be
            &ldquo;session&rdquo; cookies (deleted when you close your browser)
            or &ldquo;persistent&rdquo; cookies (stored on your device for a
            set period).
          </p>
        </section>

        {/* 2. Essential Cookies */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            2. Essential Cookies
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            These cookies are necessary for the platform to function and cannot
            be switched off. They are usually set in response to actions you
            take, such as logging in or filling in forms.
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Authentication cookies</strong>{" "}
              — Set by Clerk to maintain your login session and keep you signed
              in across pages.
            </li>
            <li>
              <strong className="text-foreground">Security cookies</strong> —
              Used to detect and prevent fraudulent activity and protect the
              integrity of the platform.
            </li>
            <li>
              <strong className="text-foreground">Preference cookies</strong> —
              Remember your settings and preferences (e.g., theme selection).
            </li>
          </ul>
        </section>

        {/* 3. Analytics Cookies */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            3. Analytics Cookies
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            These cookies help us understand how visitors interact with our
            platform. The information collected is aggregated and anonymous.
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Usage analytics</strong> —
              Track pages visited, time spent on pages, and navigation paths to
              help us improve the user experience.
            </li>
            <li>
              <strong className="text-foreground">Performance monitoring</strong>{" "}
              — Identify errors and performance bottlenecks to keep the platform
              running smoothly.
            </li>
          </ul>
        </section>

        {/* 4. Third-Party Cookies */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            4. Third-Party Cookies
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Some cookies are placed by third-party services that appear on our
            pages. We do not control these cookies.
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Stripe</strong> — Payment
              processing cookies used to facilitate secure transactions and
              prevent fraud.
            </li>
            <li>
              <strong className="text-foreground">Clerk</strong> — Authentication
              cookies used to manage user sessions and identity.
            </li>
          </ul>
        </section>

        {/* 5. Managing Cookie Preferences */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            5. Managing Cookie Preferences
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            You can control and manage cookies in several ways:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Browser settings</strong> —
              Most browsers allow you to refuse cookies or delete them. Refer to
              your browser&apos;s help documentation for instructions.
            </li>
            <li>
              <strong className="text-foreground">Opt-out tools</strong> — For
              analytics cookies, you may use browser extensions such as Google
              Analytics Opt-out Add-on.
            </li>
          </ul>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Please note that disabling essential cookies may affect the
            functionality of the platform, including your ability to log in and
            complete purchases.
          </p>
        </section>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            If you have any questions about this Cookie Policy, please{" "}
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

import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - MysteryIdea",
  description: "Get in touch with the MysteryIdea team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground">Contact Us</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Have a question, feedback, or need support? We&apos;d love to hear
          from you. Reach out and we&apos;ll get back to you as soon as
          possible.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            Email Support
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            For general inquiries, account issues, or anything else, email us
            at:
          </p>
          <a
            href="mailto:support@mysteryidea.com"
            className="mt-3 inline-flex items-center gap-2 text-foreground underline hover:no-underline"
          >
            <Mail className="h-4 w-4" />
            support@mysteryidea.com
          </a>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            Response Time
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We aim to respond to all inquiries within 1–2 business days. For
            urgent issues related to payments or account access, please include
            your registered email address in your message so we can locate your
            account quickly.
          </p>
        </section>
      </div>
    </div>
  );
}

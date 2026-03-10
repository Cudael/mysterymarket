import type { Metadata } from "next";
import { Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact - MysteryIdea",
  description: "Get in touch with the MysteryIdea team.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-[-0.03em] text-foreground">
          Contact Us
        </h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          Have a question, feedback, or need support? We&apos;d love to hear
          from you.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <section className="rounded-[20px] border border-border bg-surface p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Email Support
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              For general inquiries, account issues, or anything else, reach
              out directly.
            </p>
            <a
              href="mailto:support@mysteryidea.com"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              support@mysteryidea.com
            </a>
          </section>

          <section className="rounded-[20px] border border-border bg-surface p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <Clock className="h-5 w-5 text-gold" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              Response Time
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We aim to respond within 1–2 business days. For urgent payment
              or account issues, include your registered email so we can find
              your account quickly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

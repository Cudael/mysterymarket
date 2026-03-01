import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - MysteryIdea",
  description:
    "Read the MysteryIdea Terms of Service to understand the rules and guidelines for using our marketplace.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: February 28, 2026
        </p>

        <p className="mt-6 text-muted-foreground leading-relaxed">
          Welcome to MysteryIdea. By accessing or using our platform, you agree
          to be bound by these Terms of Service. Please read them carefully.
        </p>

        {/* 1. Platform Description */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            1. Platform Description
          </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
            MysteryIdea is a premium marketplace that allows creators to list
            hidden ideas with teaser text and buyers to unlock those ideas upon
            payment. All transactions are processed via Stripe. The platform
            charges a service fee on each transaction as disclosed at checkout.
          </p>
        </section>

        {/* 2. Acceptable Use */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            2. Acceptable Use
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            You may use MysteryIdea only for lawful purposes and in accordance
            with these Terms. You agree not to:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Post content that is unlawful, harmful, or offensive</li>
            <li>Infringe on intellectual property rights of others</li>
            <li>Use the platform to distribute spam or malicious content</li>
            <li>Attempt to circumvent any security or access controls</li>
            <li>Misrepresent your identity or affiliation</li>
          </ul>
        </section>

        {/* 3. Creator Responsibilities */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            3. Creator Responsibilities
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            As a creator on MysteryIdea, you are solely responsible for the
            content you post. You agree to:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>Provide accurate and honest descriptions of your ideas</li>
            <li>
              Ensure your content does not infringe on any third-party
              intellectual property rights (no plagiarism)
            </li>
            <li>Not post illegal, harmful, or adult content</li>
            <li>
              Fulfil any commitments implied by your teaser text — the unlocked
              content must match what was teased
            </li>
            <li>
              Connect your Stripe account to withdraw earnings from your wallet to your bank account
            </li>
          </ul>
        </section>

        {/* 4. Buyer Responsibilities */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            4. Buyer Responsibilities
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            As a buyer, when you unlock an idea you agree to:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1 text-muted-foreground">
            <li>
              Not share, reproduce, or redistribute the unlocked content without
              the creator&apos;s explicit permission
            </li>
            <li>
              Not initiate fraudulent chargebacks — disputes should be resolved
              through our refund request process
            </li>
            <li>
              Use the content only for personal, non-commercial purposes unless
              otherwise agreed with the creator
            </li>
          </ul>
        </section>

        {/* 5. Payment Terms */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            5. Payment Terms
          </h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
            All payments are processed securely through Stripe. Prices are set
            by creators and displayed in USD. MysteryIdea charges a platform fee
            (currently 15%) on each transaction; the remainder is credited to
            the creator&apos;s in-app wallet. Creators can withdraw their wallet
            balance to their bank account at any time via Stripe. Buyers may
            also deposit funds into their in-app wallet and use that balance to
            purchase ideas instantly without a Stripe checkout redirect. Wallet
            deposits are non-refundable except as part of a purchase refund.
          </p>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Refunds are handled on a case-by-case basis. Buyers may submit a
            refund request within 7 days of purchase through the platform.
            Refunds are not guaranteed and are issued at MysteryIdea&apos;s
            sole discretion.
          </p>
        </section>

        {/* 6. Intellectual Property */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            6. Intellectual Property
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Creators retain full ownership of their ideas and content. By
            posting on MysteryIdea, creators grant the platform a non-exclusive,
            worldwide, royalty-free license to display and market their teaser
            content for the purpose of facilitating sales. This license does not
            extend to the hidden content, which is only accessible to purchasers.
          </p>
        </section>

        {/* 7. Limitation of Liability */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            7. Limitation of Liability
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            To the maximum extent permitted by law, MysteryIdea shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the platform. Our total
            liability to you for any claims arising under these Terms shall not
            exceed the amount you paid to MysteryIdea in the 12 months prior to
            the claim.
          </p>
        </section>

        {/* 8. Account Termination */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            8. Account Termination
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            MysteryIdea reserves the right to suspend or terminate your account
            at any time for violations of these Terms, fraudulent activity,
            chargebacks, or any other conduct deemed harmful to the platform or
            its users. Creators found to be posting plagiarized or misleading
            content may have their ideas removed and accounts terminated without
            prior notice.
          </p>
        </section>

        {/* 9. Governing Law */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            9. Governing Law
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            These Terms are governed by and construed in accordance with the
            laws of the jurisdiction in which MysteryIdea operates
            (&ldquo;Governing Jurisdiction&rdquo;). Any disputes arising under
            these Terms shall be subject to the exclusive jurisdiction of the
            courts in that jurisdiction.
          </p>
        </section>

        {/* 10. Changes to Terms */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-foreground">
            10. Changes to These Terms
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            We may update these Terms from time to time. We will notify you of
            material changes by updating the &ldquo;Last updated&rdquo; date
            above. Continued use of the platform after changes constitutes
            acceptance of the revised Terms.
          </p>
        </section>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">
            If you have any questions about these Terms, please{" "}
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

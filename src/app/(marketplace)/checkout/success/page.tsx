import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, AlertCircle, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiEffect } from "@/components/shared/confetti-effect";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";
import prisma from "@/lib/prisma";

// Prevent static prerendering: this page calls stripe.checkout.sessions.retrieve()
// and uses Clerk auth — both require runtime credentials unavailable at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Purchase Successful - MysteryMarket",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
        <div className="w-full max-w-md rounded-[16px] border border-[#FFEAEA] bg-[#FFFFFF] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F0]">
            <AlertCircle className="h-8 w-8 text-[#D32F2F]" />
          </div>
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Invalid Session</h1>
          <p className="mt-2 text-[15px] text-[#1A1A1A]/60">No checkout session ID was provided.</p>
          <Button asChild className="mt-8 w-full h-11 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white">
            <Link href="/ideas">Return to Marketplace</Link>
          </Button>
        </div>
      </div>
    );
  }

  let ideaTitle: string | null = null;
  let amountPaid: number | null = null;
  let ideaId: string | null = null;
  let ideaCategory: string | null = null;
  let error = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    ideaTitle = session.metadata?.ideaTitle ?? null;
    ideaId = session.metadata?.ideaId ?? null;
    amountPaid = session.amount_total;
  } catch {
    error = true;
  }

  // Fetch similar ideas for post-purchase discovery
  let similarIdeas: Array<{
    id: string;
    title: string;
    teaserText: string | null;
    priceInCents: number;
    category: string | null;
  }> = [];
  if (!error && ideaId) {
    try {
      const purchasedIdea = await prisma.idea.findUnique({
        where: { id: ideaId },
        select: { category: true },
      });
      ideaCategory = purchasedIdea?.category ?? null;

      similarIdeas = await prisma.idea.findMany({
        where: {
          published: true,
          id: { not: ideaId },
          ...(ideaCategory ? { category: ideaCategory } : {}),
        },
        select: {
          id: true,
          title: true,
          teaserText: true,
          priceInCents: true,
          category: true,
        },
        orderBy: { purchases: { _count: "desc" } },
        take: 3,
      });
    } catch {
      // non-critical
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24 sm:py-32 flex items-center justify-center">
        <div className="w-full max-w-md rounded-[16px] border border-[#FFEAEA] bg-[#FFFFFF] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F0]">
            <AlertCircle className="h-8 w-8 text-[#D32F2F]" />
          </div>
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Session Not Found</h1>
          <p className="mt-2 text-[15px] text-[#1A1A1A]/60 leading-[1.6]">
            We could not verify your purchase session. If you completed a payment successfully, it will still appear in your dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild className="w-full h-11 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white">
              <Link href="/dashboard">View My Purchases</Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-11 border-[#D9DCE3] bg-[#F8F9FC] text-[#1A1A1A]">
              <Link href="/ideas">Return to Marketplace</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConfettiEffect />
      <div className="w-full max-w-[500px] rounded-[16px] border border-[#C8E6C9] bg-[#FFFFFF] p-8 sm:p-12 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8F5E9] border border-[#C8E6C9]">
          <CheckCircle className="h-10 w-10 text-[#054F31]" />
        </div>
        
        <h1 className="text-[28px] font-bold tracking-tight text-[#1A1A1A]">Payment Successful!</h1>
        
        <div className="mt-6 rounded-[8px] bg-[#F8F9FC] border border-[#D9DCE3] p-5 text-left">
          {ideaTitle && (
            <div className="pb-3 border-b border-[#D9DCE3]">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Idea Unlocked</p>
              <p className="mt-1 text-[16px] font-medium text-[#1A1A1A]">{ideaTitle}</p>
            </div>
          )}
          {amountPaid !== null && (
            <div className="pt-3">
              <p className="text-[12px] font-bold uppercase tracking-wider text-[#1A1A1A]/50">Amount Paid</p>
              <p className="mt-1 text-[16px] font-medium text-[#1A1A1A]">{formatPrice(amountPaid)}</p>
            </div>
          )}
        </div>

        <p className="mt-6 text-[15px] leading-[1.6] text-[#1A1A1A]/60">
          This insight has been successfully unlocked and permanently added to your purchase history.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button asChild className="w-full sm:w-1/2 h-12 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)] gap-2">
            <Link href={ideaId ? `/ideas/${ideaId}` : "/dashboard"}>
              Read the idea <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-1/2 h-12 border-[#D9DCE3] text-[#1A1A1A] hover:bg-[#F8F9FC]">
            <Link href="/dashboard">My Purchases</Link>
          </Button>
        </div>

      </div>

      {/* Similar ideas / What's next */}
      {similarIdeas.length > 0 && (
        <div className="mt-8 w-full max-w-[500px]">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-4 w-4 text-[#3A5FCD]" />
            <h2 className="text-[15px] font-semibold text-[#1A1A1A]">
              {ideaCategory ? `More ${ideaCategory} insights` : "You might also like"}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {similarIdeas.map((idea) => (
              <Link
                key={idea.id}
                href={`/ideas/${idea.id}`}
                className="group rounded-[10px] border border-[#D9DCE3] bg-white p-4 transition-all hover:border-[#3A5FCD]/30 hover:shadow-[0_4px_12px_rgba(58,95,205,0.08)]"
              >
                <p className="line-clamp-1 text-[14px] font-semibold text-[#1A1A1A] group-hover:text-[#3A5FCD] transition-colors">
                  {idea.title}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[12px] text-[#1A1A1A]/50">{idea.category ?? "General"}</span>
                  <span className="text-[13px] font-bold text-[#3A5FCD]">{formatPrice(idea.priceInCents)}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              href={ideaCategory ? `/ideas?category=${encodeURIComponent(ideaCategory)}` : "/ideas"}
              className="text-[13px] font-medium text-[#3A5FCD] hover:underline"
            >
              Browse all {ideaCategory ? `${ideaCategory} ` : ""}ideas →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

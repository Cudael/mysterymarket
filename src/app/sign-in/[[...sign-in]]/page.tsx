import { SignIn } from "@clerk/nextjs";
import { Sparkles, Check } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — MysteryMarket",
  description: "Sign in to your MysteryMarket account",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-between bg-[#3A5FCD] px-12 py-12">
        <div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-white/10 border border-white/20">
              <Sparkles className="h-5 w-5 text-[#E8C26A]" />
            </div>
            <span className="text-[18px] font-bold text-white tracking-tight">MysteryMarket</span>
          </Link>

          {/* Headline */}
          <div className="mt-16">
            <h1 className="text-[36px] font-bold leading-tight text-white">
              Unlock ideas that move markets
            </h1>
            <p className="mt-4 text-[16px] text-white/70 leading-relaxed">
              The premium marketplace where bold ideas meet the right buyers. Sign in to explore, buy, or sell.
            </p>
          </div>

          {/* Feature bullets */}
          <ul className="mt-10 space-y-4">
            {[
              "Access premium hidden insights",
              "Sell your ideas to the right buyers",
              "Secure payments via Stripe",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[15px] text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tagline */}
        <p className="text-[13px] text-white/50">
          © {new Date().getFullYear()} MysteryMarket. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-[60%] flex-col items-center justify-center overflow-y-auto px-4 py-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SignIn
            appearance={{
              variables: {
                colorPrimary: "#3A5FCD",
                colorText: "#1A1A1A",
                colorBackground: "#FFFFFF",
                colorDanger: "#D32F2F",
                borderRadius: "8px",
                fontFamily: "inherit",
              },
              elements: {
                cardBox: "shadow-none border-0 m-0 p-0",
                card: "bg-[#FFFFFF]",
                headerTitle: "text-[24px] font-bold tracking-tight text-[#1A1A1A]",
                headerSubtitle: "text-[15px] text-[#1A1A1A]/60",
                socialButtonsBlockButton: "border border-[#D9DCE3] bg-[#FFFFFF] hover:bg-[#F8F9FC] text-[#1A1A1A] h-11 transition-colors",
                socialButtonsBlockButtonText: "font-medium text-[#1A1A1A]",
                formButtonPrimary: "bg-[#3A5FCD] hover:bg-[#6D7BE0] h-11 text-[15px] font-medium shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all",
                formFieldInput: "bg-[#F8F9FC] border border-[#D9DCE3] text-[#1A1A1A] h-11 rounded-[8px] focus:ring-[#3A5FCD]",
                formFieldLabel: "text-[13px] font-semibold text-[#1A1A1A]/70 mb-1.5",
                footerActionLink: "text-[#3A5FCD] hover:text-[#6D7BE0] font-medium transition-colors",
                footerActionText: "text-[#1A1A1A]/60",
                dividerLine: "bg-[#D9DCE3]",
                dividerText: "text-[#1A1A1A]/50 font-medium",
                identityPreview: "border border-[#D9DCE3] bg-[#F8F9FC] rounded-[8px]",
                identityPreviewText: "text-[#1A1A1A]",
                identityPreviewEditButtonIcon: "text-[#3A5FCD]",
                formFieldWarningText: "text-[#D32F2F]",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

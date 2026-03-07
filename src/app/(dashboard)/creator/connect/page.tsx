"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { PageHeader } from "@/components/shared/page-header";
import {
  createConnectAccount,
  getConnectAccountStatus,
  createAccountLink,
  createStripeDashboardLink,
} from "@/features/stripe/actions";

type ConnectStatus = {
  connected: boolean;
  onboarded: boolean;
  accountId: string | null;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
};

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isSuccess = searchParams.get("success") === "true";
  const isRefresh = searchParams.get("refresh") === "true";

  useEffect(() => {
    async function loadStatus() {
      try {
        const s = await getConnectAccountStatus();
        setStatus(s);
        if (isSuccess && s.onboarded) {
          setSuccessMessage(
            "Your Stripe account is fully connected! You can now publish ideas."
          );
        } else if (isRefresh) {
          setSuccessMessage(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load status");
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [isSuccess, isRefresh]);

  async function handleConnect() {
    setActionLoading(true);
    setError(null);
    try {
      const result = await createConnectAccount();
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
      setActionLoading(false);
    }
  }

  async function handleCompleteOnboarding() {
    setActionLoading(true);
    setError(null);
    try {
      const result = await createAccountLink();
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
      setActionLoading(false);
    }
  }

  async function handleOpenDashboard() {
    setActionLoading(true);
    setError(null);
    try {
      const result = await createStripeDashboardLink();
      window.open(result.url, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open dashboard");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Creator", href: "/creator" },
          { label: "Payouts" },
        ]}
      />
      <PageHeader
        title="Stripe Connect"
        description="Connect a Stripe account to receive payouts directly from your idea sales. A 15% platform fee applies to each transaction."
        icon={<CreditCard className="h-6 w-6 text-[#FFFFFF]" />}
      />

      {successMessage && (
        <div className="mt-6 flex items-center gap-3 rounded-[8px] border border-[#C8E6C9] bg-[#E8F5E9] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <CheckCircle className="h-5 w-5 text-[#054F31]" />
          <p className="text-[14px] font-medium text-[#054F31]">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-[8px] border border-[#FFEAEA] bg-[#FFF0F0] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <AlertCircle className="h-5 w-5 text-[#D32F2F]" />
          <p className="text-[14px] font-medium text-[#D32F2F]">{error}</p>
        </div>
      )}

      <div className="mt-8 rounded-[12px] border border-[#D9DCE3] bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#3A5FCD]" />
            <p className="text-[14px] font-medium text-[#1A1A1A]/50">
              Loading account status...
            </p>
          </div>
        ) : !status?.connected ? (
          <div className="flex flex-col items-center text-center px-6 py-12 sm:px-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#F8F9FC] border border-[#D9DCE3]">
              <CreditCard className="h-7 w-7 text-[#1A1A1A]/40" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1A1A]">
              Not Connected
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-[1.6] text-[#1A1A1A]/60">
              You must connect a Stripe account to accept payments for your ideas. You&apos;ll be securely redirected to complete Stripe&apos;s standard onboarding process.
            </p>
            <Button
              className="mt-8 w-full sm:w-auto px-8 h-11 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all gap-2"
              onClick={handleConnect}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Connect with Stripe
            </Button>
          </div>
        ) : !status.onboarded ? (
          <div className="flex flex-col items-center text-center px-6 py-12 sm:px-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#FFF8E1] border border-[#FFECB3]">
              <AlertCircle className="h-7 w-7 text-[#B8860B]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1A1A]">
              Onboarding Incomplete
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-[1.6] text-[#1A1A1A]/60">
              Your Stripe account is created, but you must complete the required onboarding steps to start receiving payments.
            </p>
            <Button
              className="mt-8 w-full sm:w-auto px-8 h-11 bg-[#3A5FCD] hover:bg-[#6D7BE0] text-white shadow-[0_2px_8px_rgba(58,95,205,0.25)] transition-all gap-2"
              onClick={handleCompleteOnboarding}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              Complete Onboarding
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-6 py-12 sm:px-12">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#E8F5E9] border border-[#C8E6C9]">
              <CheckCircle className="h-7 w-7 text-[#054F31]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#1A1A1A]">
              Stripe Connected
            </h2>
            <p className="mt-1.5 text-[14px] font-medium text-[#1A1A1A]/50">
              Account ID: {status.accountId}
            </p>

            <div className="mt-8 w-full space-y-0 rounded-[8px] border border-[#D9DCE3] bg-[#F8F9FC] text-left overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#D9DCE3]">
                <span className="text-[14px] font-medium text-[#1A1A1A]/70">
                  Payments Enabled
                </span>
                {status.chargesEnabled ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-[#054F31]" />
                    <span className="text-[13px] font-semibold text-[#054F31]">Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-[#D32F2F]" />
                    <span className="text-[13px] font-semibold text-[#D32F2F]">No</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-4">
                <span className="text-[14px] font-medium text-[#1A1A1A]/70">
                  Payouts Enabled
                </span>
                {status.payoutsEnabled ? (
                   <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-[#054F31]" />
                    <span className="text-[13px] font-semibold text-[#054F31]">Yes</span>
                  </div>
                ) : (
                   <div className="flex items-center gap-1.5">
                    <XCircle className="h-4 w-4 text-[#D32F2F]" />
                    <span className="text-[13px] font-semibold text-[#D32F2F]">No</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="mt-8 w-full gap-2 h-11 border-[#D9DCE3] bg-[#FFFFFF] text-[#1A1A1A] hover:bg-[#F8F9FC] hover:text-[#3A5FCD] transition-colors"
              variant="outline"
              onClick={handleOpenDashboard}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#3A5FCD]" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              View Stripe Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

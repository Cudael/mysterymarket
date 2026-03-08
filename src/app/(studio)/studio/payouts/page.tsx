"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  ExternalLink,
  Loader2,
  AlertCircle,
  Wallet2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { ContentCard } from "@/components/shared/content-card";
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

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: boolean | undefined;
}) {
  const positive = Boolean(value);

  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[#D9DCE3] bg-[#F8F9FC] px-4 py-3">
      <span className="text-[14px] font-medium text-[#1A1A1A]/70">{label}</span>
      {positive ? (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-[#054F31]" />
          <span className="text-[13px] font-semibold text-[#054F31]">Enabled</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-[#D32F2F]" />
          <span className="text-[13px] font-semibold text-[#D32F2F]">Needs attention</span>
        </div>
      )}
    </div>
  );
}

export default function PayoutsPage() {
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
        const result = await getConnectAccountStatus();
        setStatus(result);

        if (isSuccess && result.onboarded) {
          setSuccessMessage(
            "Your Stripe account is fully connected and ready for payouts."
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
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open dashboard");
    } finally {
      setActionLoading(false);
    }
  }

  const state = useMemo(() => {
    if (!status?.connected) return "not_connected";
    if (!status.onboarded) return "incomplete";
    return "connected";
  }, [status]);

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 space-y-8 pb-12 duration-500">
      <PageHeader
        title="Payout Settings"
        description="Connect Stripe to receive payouts, monitor account status, and keep payment capabilities active."
        icon={<CreditCard className="h-6 w-6 text-white" />}
      />

      {successMessage && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[#C8E6C9] bg-[#E8F5E9] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <CheckCircle className="h-5 w-5 text-[#054F31]" />
          <p className="text-[14px] font-medium text-[#054F31]">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-[12px] border border-[#FFEAEA] bg-[#FFF0F0] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <AlertCircle className="h-5 w-5 text-[#D32F2F]" />
          <p className="text-[14px] font-medium text-[#D32F2F]">{error}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <ContentCard title="Stripe Connection" bodyClassName="p-0">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#3A5FCD]" />
              <p className="text-[14px] font-medium text-[#1A1A1A]/50">
                Loading account status...
              </p>
            </div>
          ) : state === "not_connected" ? (
            <div className="px-6 py-10 sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#F8F9FC] border border-[#D9DCE3]">
                <CreditCard className="h-7 w-7 text-[#3A5FCD]" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-[#1A1A1A]">
                Connect Stripe to enable payouts
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#1A1A1A]/60">
                You can create and publish ideas before connecting payouts, but a
                completed Stripe setup is required before funds can be transferred
                out of your creator wallet.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-4">
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">
                    Secure onboarding
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/55">
                    You&apos;ll be redirected to Stripe to complete verification and
                    account setup.
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#D9DCE3] bg-[#F8F9FC] p-4">
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">
                    Required for withdrawals
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/55">
                    Earnings can accumulate in your wallet, but payouts require an
                    active connected account.
                  </p>
                </div>
              </div>

              <Button
                className="mt-8 h-11 gap-2 px-8"
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
          ) : state === "incomplete" ? (
            <div className="px-6 py-10 sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#FFECB3] bg-[#FFF8E1]">
                <AlertCircle className="h-7 w-7 text-[#B8860B]" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-[#1A1A1A]">
                Finish your Stripe onboarding
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#1A1A1A]/60">
                Your Stripe account exists, but setup is incomplete. Finish the
                remaining steps to activate payments and payouts.
              </p>

              <div className="mt-6 space-y-3">
                <StatusRow label="Account connected" value={status?.connected} />
                <StatusRow label="Onboarding complete" value={status?.onboarded} />
                <StatusRow label="Payments enabled" value={status?.chargesEnabled} />
                <StatusRow label="Payouts enabled" value={status?.payoutsEnabled} />
              </div>

              <Button
                className="mt-8 h-11 gap-2 px-8"
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
            <div className="px-6 py-10 sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#C8E6C9] bg-[#E8F5E9]">
                <CheckCircle className="h-7 w-7 text-[#054F31]" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-[#1A1A1A]">
                Stripe is connected
              </h2>
              <p className="mt-2 text-[14px] text-[#1A1A1A]/50">
                Account ID: {status?.accountId}
              </p>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#1A1A1A]/60">
                Your payout setup looks healthy. You can use the Stripe dashboard
                to review verification details, bank info, and payout activity.
              </p>

              <div className="mt-6 space-y-3">
                <StatusRow label="Payments enabled" value={status?.chargesEnabled} />
                <StatusRow label="Payouts enabled" value={status?.payoutsEnabled} />
              </div>

              <Button
                className="mt-8 h-11 gap-2"
                variant="outline"
                onClick={handleOpenDashboard}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#3A5FCD]" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                Open Stripe Dashboard
              </Button>
            </div>
          )}
        </ContentCard>

        <div className="space-y-6">
          <ContentCard title="Why connect payouts?" bodyClassName="p-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <Wallet2 className="mt-0.5 h-5 w-5 text-[#3A5FCD]" />
                <div>
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">
                    Withdraw earnings
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/55">
                    Stripe is required to move funds out of your wallet.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-[#3A5FCD]" />
                <div>
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">
                    Verification and compliance
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-[#1A1A1A]/55">
                    Identity checks and payout controls are handled securely
                    through Stripe onboarding.
                  </p>
                </div>
              </div>
            </div>
          </ContentCard>

          <ContentCard title="Platform fee" bodyClassName="p-6">
            <p className="text-[14px] leading-6 text-[#1A1A1A]/60">
              A 15% platform fee applies to each transaction. Your analytics and
              wallet views already reflect net creator earnings where applicable.
            </p>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}

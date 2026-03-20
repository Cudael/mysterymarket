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
    <div className="flex items-center justify-between rounded-[10px] border border-border bg-muted px-4 py-3">
      <span className="text-[14px] font-medium text-muted-foreground">{label}</span>
      {positive ? (
        <div className="flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <span className="text-[13px] font-semibold text-green-400">Enabled</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <XCircle className="h-4 w-4 text-destructive" />
          <span className="text-[13px] font-semibold text-destructive">Needs attention</span>
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
        <div className="flex items-center gap-3 rounded-[12px] border border-green-500/20 bg-green-500/10 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <p className="text-[14px] font-medium text-green-400">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-[12px] border border-destructive/20 bg-destructive/10 p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-[14px] font-medium text-destructive">{error}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <ContentCard title="Stripe Connection" bodyClassName="p-0">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-[14px] font-medium text-muted-foreground">
                Loading account status...
              </p>
            </div>
          ) : state === "not_connected" ? (
            <div className="px-6 py-10 sm:px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-muted border border-border">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-foreground">
                Connect Stripe to enable payouts
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                You can create and publish ideas before connecting payouts, but a
                completed Stripe setup is required before funds can be transferred
                out of your creator wallet.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[12px] border border-border bg-muted p-4">
                  <p className="text-[14px] font-semibold text-foreground">
                    Secure onboarding
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                    You&apos;ll be redirected to Stripe to complete verification and
                    account setup.
                  </p>
                </div>

                <div className="rounded-[12px] border border-border bg-muted p-4">
                  <p className="text-[14px] font-semibold text-foreground">
                    Required for withdrawals
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
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
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-yellow-500/20 bg-yellow-500/10">
                <AlertCircle className="h-7 w-7 text-yellow-400" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-foreground">
                Finish your Stripe onboarding
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
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
              <div className="flex h-14 w-14 items-center justify-center rounded-[14px] border border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-7 w-7 text-green-400" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-foreground">
                Stripe is connected
              </h2>
              <p className="mt-2 text-[14px] text-muted-foreground">
                Account ID: {status?.accountId}
              </p>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
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
                  <Loader2 className="h-4 w-4 animate-spin" />
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
                <Wallet2 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-[14px] font-semibold text-foreground">
                    Withdraw earnings
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                    Stripe is required to move funds out of your wallet.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-[14px] font-semibold text-foreground">
                    Verification and compliance
                  </p>
                  <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                    Identity checks and payout controls are handled securely
                    through Stripe onboarding.
                  </p>
                </div>
              </div>
            </div>
          </ContentCard>

          <ContentCard title="Platform fee" bodyClassName="p-6">
            <p className="text-[14px] leading-6 text-muted-foreground">
              A 15% platform fee applies to each transaction. Your analytics and
              wallet views already reflect net creator earnings where applicable.
            </p>
          </ContentCard>
        </div>
      </div>
    </div>
  );
}

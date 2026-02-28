"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  createConnectAccount,
  getConnectAccountStatus,
  createAccountLink,
  createStripeDashboardLink,
} from "@/actions/stripe-connect";

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
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">
        Connect Your Stripe Account
      </h1>
      <p className="mt-2 text-muted-foreground">
        Connect a Stripe account to receive payments from your ideas. A 15%
        platform fee applies to each sale.
      </p>

      {successMessage && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-sm text-foreground">{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading account status...
            </p>
          </div>
        ) : !status?.connected ? (
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Not Connected
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Connect your Stripe account to start accepting payments for your
              ideas. You&apos;ll need to complete Stripe&apos;s onboarding
              process.
            </p>
            <Button
              className="mt-6 w-full gap-2"
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
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Onboarding Incomplete
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Your Stripe account is connected but you need to complete the
              onboarding process to start receiving payments.
            </p>
            <Button
              className="mt-6 w-full gap-2"
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
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Stripe Connected
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Account ID: {status.accountId}
            </p>

            <div className="mt-6 w-full space-y-3 rounded-lg border border-border p-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Charges Enabled
                </span>
                {status.chargesEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Payouts Enabled
                </span>
                {status.payoutsEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
              </div>
            </div>

            <Button
              className="mt-6 w-full gap-2"
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
      </div>

      <div className="mt-6">
        <Link
          href="/creator"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Creator Studio
        </Link>
      </div>
    </div>
  );
}

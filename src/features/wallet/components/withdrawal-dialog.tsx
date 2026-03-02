"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import { requestWithdrawal } from "@/features/wallet/actions";

interface WithdrawalDialogProps {
  balanceInCents: number;
}

export function WithdrawalDialog({ balanceInCents }: WithdrawalDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState((balanceInCents / 100).toFixed(2));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountInCents) || amountInCents < 1000) {
      toast.error("Minimum withdrawal is $10.00");
      return;
    }

    if (amountInCents > balanceInCents) {
      toast.error("Amount exceeds your available balance");
      return;
    }

    setLoading(true);
    try {
      await requestWithdrawal(amountInCents);
      toast.success("Withdrawal request submitted!");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Withdraw</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-sm text-muted-foreground">Available balance</p>
            <p className="text-xl font-bold text-foreground">
              {formatPrice(balanceInCents)}
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="withdrawal-amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="withdrawal-amount"
                type="number"
                step="0.01"
                min="10"
                max={(balanceInCents / 100).toFixed(2)}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum withdrawal: $10.00
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting…" : "Submit Withdrawal Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
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
import { createDepositSession } from "@/actions/wallet";

const PRESET_AMOUNTS = [10, 25, 50, 100];

export function DepositDialog() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("25.00");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);

    if (isNaN(amountInCents) || amountInCents < 500) {
      toast.error("Minimum deposit is $5.00");
      return;
    }
    if (amountInCents > 50000) {
      toast.error("Maximum deposit is $500.00");
      return;
    }

    setLoading(true);
    try {
      const result = await createDepositSession(amountInCents);
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Funds
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Quick amounts</Label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_AMOUNTS.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant={amount === preset.toFixed(2) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAmount(preset.toFixed(2))}
                >
                  ${preset}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="deposit-amount">Custom amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="deposit-amount"
                type="number"
                step="0.01"
                min="5"
                max="500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum $5.00 · Maximum $500.00
            </p>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Redirecting to Stripe…" : "Add Funds"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

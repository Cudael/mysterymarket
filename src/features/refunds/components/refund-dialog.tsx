"use client";

import { useState, useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { createRefundRequest } from "@/features/refunds/actions";

type RefundRequestStatus = "PENDING" | "APPROVED" | "DENIED";

interface RefundDialogProps {
  purchaseId: string;
  existingStatus?: RefundRequestStatus;
}

const STATUS_LABELS: Record<RefundRequestStatus, string> = {
  PENDING: "Pending Review",
  APPROVED: "Approved",
  DENIED: "Denied",
};

const STATUS_VARIANTS: Record<
  RefundRequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  APPROVED: "default",
  DENIED: "destructive",
};

const MIN_REASON_LENGTH = 20;
const MAX_REASON_LENGTH = 1000;

export function RefundDialog({ purchaseId, existingStatus }: RefundDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  if (existingStatus) {
    return (
      <Badge variant={STATUS_VARIANTS[existingStatus]}>
        Refund: {STATUS_LABELS[existingStatus]}
      </Badge>
    );
  }

  const reasonLength = reason.trim().length;
  const isTooShort = reasonLength > 0 && reasonLength < MIN_REASON_LENGTH;
  const charsRemaining = MAX_REASON_LENGTH - reason.length;

  function handleSubmit() {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund request");
      return;
    }
    if (reasonLength < MIN_REASON_LENGTH) {
      toast.error(`Please provide at least ${MIN_REASON_LENGTH} characters`);
      return;
    }
    startTransition(async () => {
      try {
        await createRefundRequest(purchaseId, reason);
        toast.success("Refund request submitted successfully");
        setOpen(false);
        setReason("");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to submit refund request"
        );
      }
    });
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Request Refund
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Refund</DialogTitle>
            <DialogDescription>
              Describe why you&apos;d like a refund. Our team will review your
              request and respond within 3–5 business days.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-1.5">
            <Textarea
              placeholder="Explain why you're requesting a refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, MAX_REASON_LENGTH))}
              rows={4}
              aria-label="Refund reason"
            />
            <div className="flex items-center justify-between text-xs">
              {isTooShort ? (
                <p className="text-destructive">
                  {MIN_REASON_LENGTH - reasonLength} more characters needed
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Minimum {MIN_REASON_LENGTH} characters required
                </p>
              )}
              <p className={charsRemaining < 100 ? "text-amber-500" : "text-muted-foreground"}>
                {charsRemaining} remaining
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || reasonLength < MIN_REASON_LENGTH}>
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

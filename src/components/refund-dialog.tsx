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
import { createRefundRequest } from "@/actions/refunds";

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

  function handleSubmit() {
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund request");
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

          <div className="py-2">
            <Textarea
              placeholder="Explain why you're requesting a refund..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

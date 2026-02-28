"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
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
import { createReport, type ReportReason } from "@/actions/reports";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "MISLEADING", label: "Misleading" },
  { value: "INAPPROPRIATE", label: "Inappropriate" },
  { value: "SPAM", label: "Spam" },
  { value: "PLAGIARISM", label: "Plagiarism" },
  { value: "OTHER", label: "Other" },
];

interface ReportDialogProps {
  ideaId: string;
}

export function ReportDialog({ ideaId }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [details, setDetails] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!reason) {
      toast.error("Please select a reason");
      return;
    }
    startTransition(async () => {
      try {
        await createReport(ideaId, reason as ReportReason, details);
        toast.success("Report submitted. We'll review it shortly.");
        setOpen(false);
        setReason("");
        setDetails("");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to submit report"
        );
      }
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Flag className="h-4 w-4 mr-1" />
        Report
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Idea</DialogTitle>
            <DialogDescription>
              Let us know why you&apos;re reporting this idea. We review all
              reports carefully.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="" disabled>
                Select a reason
              </option>
              {REASONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <Textarea
              placeholder="Additional details (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
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
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

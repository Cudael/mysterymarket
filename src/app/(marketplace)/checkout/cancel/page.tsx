import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Purchase Cancelled - MysteryIdea",
};

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Purchase Cancelled</h1>
      <p className="mt-2 text-muted-foreground">
        Your purchase was cancelled. You have not been charged.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link href="/ideas">Browse ideas</Link>
        </Button>
      </div>
    </div>
  );
}

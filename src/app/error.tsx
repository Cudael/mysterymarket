"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-white">
      <div className="text-center">
        <p className="text-6xl font-bold text-destructive">500</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button onClick={reset} className="mt-8">
          Try again
        </Button>
      </div>
    </div>
  );
}

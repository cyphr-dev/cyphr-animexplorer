"use client";

import AnimeEmptyState from "@/components/AnimeEmptyState";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AnimeDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Anime details error:", error);
  }, [error]);

  return (
    <AnimeEmptyState
      title="Error Loading Anime Details"
      description="We encountered an error while trying to load the anime details."
      icon={<AlertCircle className="w-24 h-24 text-destructive" />}
    >
      <Alert variant="destructive" className="max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Possible Reasons</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1">
            <li>The anime ID might not exist</li>
            <li>Network connection issues</li>
            <li>API rate limiting</li>
            <li>Server unavailability</li>
          </ul>
          {error.digest && (
            <p className="text-xs mt-2 opacity-70">Error ID: {error.digest}</p>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button onClick={reset} variant="default">
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    </AnimeEmptyState>
  );
}

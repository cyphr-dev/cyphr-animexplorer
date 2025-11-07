"use client";

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Error</span>
        </nav>

        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Anime Details</AlertTitle>
            <AlertDescription>
              <p className="mb-4">
                We encountered an error while trying to load the anime details.
                This could be due to:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>The anime ID might not exist</li>
                <li>Network connection issues</li>
                <li>API rate limiting</li>
                <li>Server unavailability</li>
              </ul>
              {error.digest && (
                <p className="text-xs mt-2 opacity-70">
                  Error ID: {error.digest}
                </p>
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
        </div>
      </div>
    </div>
  );
}

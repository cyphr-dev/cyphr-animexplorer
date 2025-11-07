import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function AnimeNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Not Found</span>
        </nav>

        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          <FileQuestion className="w-24 h-24 text-muted-foreground" />

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Anime Not Found</h1>
            <p className="text-muted-foreground text-lg">
              The anime you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
          </div>

          <Alert className="max-w-2xl">
            <FileQuestion className="h-4 w-4" />
            <AlertTitle>What happened?</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                <li>The anime ID might be invalid</li>
                <li>The anime might have been removed from the database</li>
                <li>There might be a typo in the URL</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Link href="/">
            <Button size="lg">Browse All Anime</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

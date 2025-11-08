import { FileQuestion } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import Link from "next/link";

interface AnimeEmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode; // Optional custom icon for the empty state
  children?: React.ReactNode; // Additional information or actions
}

export default function AnimeEmptyState({
  title,
  description,
  icon,
  children,
}: AnimeEmptyStateProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
          <FileQuestion className="w-24 h-24 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          {/* Additional Information Alert */}
          {children}
          <Link href="/browse">
            <Button size="lg">Browse All Anime</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

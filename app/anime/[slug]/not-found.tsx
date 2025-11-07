import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { FileQuestion } from "lucide-react";

export default function AnimeNotFound() {
  return (
    <AnimeEmptyState
      title="Anime Not Found"
      description="The anime you're looking for doesn't exist or has been removed."
      icon={<FileQuestion className="w-24 h-24 text-muted-foreground" />}
    >
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
    </AnimeEmptyState>
  );
}

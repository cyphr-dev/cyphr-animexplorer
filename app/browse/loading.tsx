import { AnimeListSkeleton } from "@/components/AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-4 sm:pt-8">
        <header className="mb-6">
          <Skeleton className="h-10 w-64" />
        </header>
        <AnimeListSkeleton />
      </div>
    </div>
  );
}

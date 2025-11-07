import { AnimeListSkeleton } from "@/components/AnimeCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </header>
        <AnimeListSkeleton />
      </div>
    </div>
  );
}

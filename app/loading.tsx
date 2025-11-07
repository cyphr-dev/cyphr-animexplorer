import { AnimeListSkeleton } from "@/components/AnimeCard";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="h-10 w-64 bg-muted animate-pulse rounded mb-2" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded" />
        </header>

        <AnimeListSkeleton />
      </div>
    </div>
  );
}

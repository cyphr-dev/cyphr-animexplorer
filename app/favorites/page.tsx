import { Suspense } from "react";
import { fetchGenres } from "@/lib/api/jikan";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import FavoritesAnimeList from "@/components/FavoritesAnimeList";
import { AnimeListSkeleton } from "@/components/AnimeCard";

async function FavoritesList() {
  let genres;
  try {
    // Fetch genres for filtering
    genres = await fetchGenres();
  } catch (error) {
    console.error("Error loading genres:", error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load genre data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return <FavoritesAnimeList initialGenres={genres} />;
}

export default async function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<AnimeListSkeleton />}>
          <FavoritesList />
        </Suspense>
      </div>
    </div>
  );
}

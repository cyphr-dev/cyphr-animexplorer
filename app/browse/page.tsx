import { Suspense } from "react";
import { fetchAnimeList, fetchGenres } from "@/lib/api/jikan";
import { AnimeListSkeleton } from "@/components/AnimeCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import BrowseAnimeList from "@/components/BrowseAnimeList";
import BackToTop from "@/components/BackToTop";

async function AnimeList() {
  let data, genres;
  try {
    // Fetch initial data and genres in parallel
    [data, genres] = await Promise.all([
      fetchAnimeList({ page: 1, limit: 20 }),
      fetchGenres(),
    ]);
  } catch (error) {
    console.error("Error loading anime:", error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load anime data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <BrowseAnimeList
      initialData={data.data}
      initialPage={1}
      initialGenres={genres}
    />
  );
}

export default async function BrowsePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1>Browse All Anime</h1>
        </header>
        <Suspense fallback={<AnimeListSkeleton />}>
          <AnimeList />
        </Suspense>
      </div>

      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

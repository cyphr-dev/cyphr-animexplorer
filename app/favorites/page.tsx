import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchGenres } from "@/lib/api/jikan";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { AlertCircle } from "lucide-react";
import { AnimeListSkeleton } from "@/components/AnimeCard";
import FavoritesAnimeList from "@/components/FavoritesAnimeList";

export const metadata: Metadata = {
  title: "My Favorites",
  description:
    "View and manage your favorite anime. Keep track of anime you want to watch or have enjoyed.",
  openGraph: {
    title: "My Favorites | Anime Explorer",
    description:
      "View and manage your favorite anime. Keep track of anime you want to watch or have enjoyed.",
    url: "/favorites",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Favorites | Anime Explorer",
    description:
      "View and manage your favorite anime. Keep track of anime you want to watch or have enjoyed.",
  },
};

async function FavoritesList() {
  let genres;
  try {
    // Fetch genres for filtering
    genres = await fetchGenres();
  } catch (error) {
    console.error("Error loading genres:", error);
    return (
      <AnimeEmptyState
        title="Unable to Load Genre Data"
        description="Failed to load genre data. Please try again later."
        icon={<AlertCircle className="w-24 h-24 text-destructive" />}
      />
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

import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchAnimeList, fetchGenres } from "@/lib/api/jikan";
import { AnimeListSkeleton } from "@/components/AnimeCard";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { AlertCircle } from "lucide-react";
import BrowseAnimeList from "@/components/BrowseAnimeList";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Browse All Anime",
  description:
    "Browse and filter through thousands of anime titles. Search by genre, type, status, and more to find your next anime to watch.",
  openGraph: {
    title: "Browse All Anime | Anime Explorer",
    description:
      "Browse and filter through thousands of anime titles. Search by genre, type, status, and more to find your next anime to watch.",
    url: "/browse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Anime | Anime Explorer",
    description:
      "Browse and filter through thousands of anime titles. Search by genre, type, status, and more to find your next anime to watch.",
  },
};

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
      <AnimeEmptyState
        title="Unable to Load Anime Data"
        description="Failed to load anime data. Please try again later."
        icon={<AlertCircle className="w-24 h-24 text-destructive" />}
      />
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
        <header className="mb-6">
          <h2>Browse All Anime</h2>
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

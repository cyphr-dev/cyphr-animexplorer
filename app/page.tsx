import AnimeHero from "@/components/AnimeHero";
import AnimeCategorySection from "@/components/AnimeCategorySection";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { AlertCircle } from "lucide-react";
import { fetchTopAnime, fetchAnimeList } from "@/lib/api/jikan";

export default async function Home() {
  // Fetch initial data on server for SSR
  let popularAnime = null;
  let latestSeries = null;
  let latestMovies = null;
  let hasError = false;

  try {
    // Fetch all data in parallel for faster SSR
    const [popularResult, seriesResult, moviesResult] =
      await Promise.allSettled([
        fetchTopAnime("bypopularity"),
        fetchAnimeList({
          type: "tv",
          order_by: "start_date",
          sort: "desc",
          limit: 10,
        }),
        fetchAnimeList({
          type: "movie",
          order_by: "start_date",
          sort: "desc",
          limit: 10,
        }),
      ]);

    // Handle results
    if (popularResult.status === "fulfilled") {
      popularAnime = popularResult.value;
    }
    if (seriesResult.status === "fulfilled") {
      latestSeries = seriesResult.value.data;
    }
    if (moviesResult.status === "fulfilled") {
      latestMovies = moviesResult.value.data;
    }

    // Check if everything failed
    hasError =
      popularResult.status === "rejected" &&
      seriesResult.status === "rejected" &&
      moviesResult.status === "rejected";
  } catch (error) {
    console.error("Error fetching home page data:", error);
    hasError = true;
  }

  return (
    <div className="min-h-screen bg-background -mt-18">
      {/* Hero Section */}
      <AnimeHero />
      <div className="container mx-auto px-4 pt-4 md:pt-8 flex flex-col gap-12">
        {/* Category Sections */}
        {hasError ? (
          <AnimeEmptyState
            title="Unable to Load Content"
            description="We're having trouble loading anime data. Please try refreshing the page."
            icon={<AlertCircle className="w-24 h-24 text-muted-foreground" />}
          />
        ) : (
          <div className="space-y-4">
            {/* Most Popular */}
            {popularAnime && (
              <AnimeCategorySection
                title="Most Popular"
                description="Fan favorites and trending anime"
                animeList={popularAnime}
                viewAllLink="/browse?order_by=popularity&sort=asc"
                largerCards={true}
              />
            )}

            {/* Latest Series */}
            {latestSeries && (
              <AnimeCategorySection
                title="Latest Series"
                description="Recent TV anime releases"
                animeList={latestSeries}
                viewAllLink="/browse?type=tv&order_by=start_date&sort=desc"
              />
            )}

            {/* Latest Movies */}
            {latestMovies && (
              <AnimeCategorySection
                title="Latest Movies"
                description="Recent anime movie releases"
                animeList={latestMovies}
                viewAllLink="/browse?type=movie&order_by=start_date&sort=desc"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

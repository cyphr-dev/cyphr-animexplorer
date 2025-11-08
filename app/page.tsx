import {
  fetchTopAnime,
  fetchCurrentlyAiring,
  fetchAnimeByTypeAndStatus,
} from "@/lib/api/jikan";
import AnimeCategorySection from "@/components/AnimeCategorySection";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import AnimeHero from "@/components/AnimeHero";
import { AlertCircle } from "lucide-react";

// Add a delay utility to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Home() {
  // Load categories sequentially to avoid rate limiting
  let newestAnime = null;
  let newestError = false;
  try {
    newestAnime = await fetchCurrentlyAiring();
    await delay(1000); // Wait 1 second between requests
  } catch (error) {
    console.error("Error loading newest anime:", error);
    newestError = true;
  }

  let popularAnime = null;
  let popularError = false;
  try {
    popularAnime = await fetchTopAnime("bypopularity");
    await delay(1000);
  } catch (error) {
    console.error("Error loading popular anime:", error);
    popularError = true;
  }

  let latestSeries = null;
  let seriesError = false;
  try {
    latestSeries = await fetchAnimeByTypeAndStatus("tv");
    await delay(1000);
  } catch (error) {
    console.error("Error loading latest series:", error);
    seriesError = true;
  }

  let latestMovies = null;
  let moviesError = false;
  try {
    latestMovies = await fetchAnimeByTypeAndStatus("movie");
  } catch (error) {
    console.error("Error loading latest movies:", error);
    moviesError = true;
  }

  return (
    <div className="min-h-screen bg-background -mt-18">
      {/* Hero Section */}
      <AnimeHero />
      <div className="container mx-auto px-4 pt-4 md:pt-8 flex flex-col gap-12">
        {/* Category Sections */}
        {newestError && popularError && seriesError && moviesError ? (
          <AnimeEmptyState
            title="Unable to Load Content"
            description="We're having trouble loading anime data. Please try refreshing the page."
            icon={<AlertCircle className="w-24 h-24 text-muted-foreground" />}
          />
        ) : (
          <div className="space-y-4">
            {/* Most Popular */}
            {popularAnime && !popularError ? (
              <AnimeCategorySection
                title="Most Popular"
                description="Fan favorites and trending anime"
                animeList={popularAnime}
                viewAllLink="/browse?order_by=popularity&sort=asc"
                largerCards={true}
              />
            ) : null}

            {/* Newest Anime */}
            {newestAnime && !newestError ? (
              <AnimeCategorySection
                title="Latest"
                description="Currently airing anime this season"
                animeList={newestAnime}
                viewAllLink="/browse?status=airing&order_by=start_date&sort=desc"
              />
            ) : null}

            {/* Latest Series */}
            {latestSeries && !seriesError ? (
              <AnimeCategorySection
                title="Latest Series"
                description="Recent TV anime releases"
                animeList={latestSeries}
                viewAllLink="/browse?type=tv&order_by=start_date&sort=desc"
              />
            ) : null}

            {/* Latest Movies */}
            {latestMovies && !moviesError ? (
              <AnimeCategorySection
                title="Latest Movies"
                description="Recent anime movie releases"
                animeList={latestMovies}
                viewAllLink="/browse?type=movie&order_by=start_date&sort=desc"
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

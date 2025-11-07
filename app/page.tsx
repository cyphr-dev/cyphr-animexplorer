import {
  fetchTopAnime,
  fetchCurrentlyAiring,
  fetchAnimeByTypeAndStatus,
} from "@/lib/api/jikan";
import AnimeCategorySection from "@/components/AnimeCategorySection";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="min-h-screen bg-background -mt-17">
      {/* Hero Section */}
      <header className="flex flex-col h-[55dvh] align-middle justify-center bg-accent">
        <div className="p-4 container mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent ">
              AnimeXplorer
            </h1>
            <p className=" text-lg md:text-xl max-w-2xl">
              Discover and explore the world of anime. From the latest releases
              to timeless classics.
            </p>
          </div>

          <Link href="/browse" className="w-fit">
            <Button size="lg" className="text-lg px-8">
              Browse All Anime
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 flex flex-col gap-12">
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

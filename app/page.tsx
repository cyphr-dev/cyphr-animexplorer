import { Suspense } from "react";
import {
  fetchTopAnime,
  fetchCurrentlyAiring,
  fetchAnimeByTypeAndStatus,
} from "@/lib/api/jikan";
import AnimeCategorySection from "@/components/AnimeCategorySection";
import { CategorySectionSkeleton } from "@/components/CategorySectionSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Fetch newest anime (currently airing)
async function NewestAnimeSection() {
  let data;
  try {
    data = await fetchCurrentlyAiring();
  } catch (error) {
    console.error("Error loading newest anime:", error);
    return (
      <Alert variant="destructive" className="mb-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load newest anime.</AlertDescription>
      </Alert>
    );
  }

  return (
    <AnimeCategorySection
      title="Newest"
      description="Currently airing anime this season"
      animeList={data}
      viewAllLink="/browse?status=airing&order_by=start_date&sort=desc"
    />
  );
}

// Fetch most popular anime
async function MostPopularSection() {
  let data;
  try {
    data = await fetchTopAnime("bypopularity");
  } catch (error) {
    console.error("Error loading popular anime:", error);
    return (
      <Alert variant="destructive" className="mb-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load popular anime.</AlertDescription>
      </Alert>
    );
  }

  return (
    <AnimeCategorySection
      title="Most Popular"
      description="Fan favorites and trending anime"
      animeList={data}
      viewAllLink="/browse?order_by=popularity&sort=asc"
    />
  );
}

// Fetch latest TV series
async function LatestSeriesSection() {
  let data;
  try {
    data = await fetchAnimeByTypeAndStatus("tv");
  } catch (error) {
    console.error("Error loading latest series:", error);
    return (
      <Alert variant="destructive" className="mb-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load latest series.</AlertDescription>
      </Alert>
    );
  }

  return (
    <AnimeCategorySection
      title="Latest Series"
      description="Recent TV anime releases"
      animeList={data}
      viewAllLink="/browse?type=tv&order_by=start_date&sort=desc"
    />
  );
}

// Fetch latest movies
async function LatestMoviesSection() {
  let data;
  try {
    data = await fetchAnimeByTypeAndStatus("movie");
  } catch (error) {
    console.error("Error loading latest movies:", error);
    return (
      <Alert variant="destructive" className="mb-12">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load latest movies.</AlertDescription>
      </Alert>
    );
  }

  return (
    <AnimeCategorySection
      title="Latest Movies"
      description="Recent anime movie releases"
      animeList={data}
      viewAllLink="/browse?type=movie&order_by=start_date&sort=desc"
    />
  );
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-12">
        {/* Hero Section */}
        <header className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Anime Explorer
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
            Discover and explore the world of anime. From the latest releases to
            timeless classics.
          </p>
          <Link href="/browse" className="w-fit">
            <Button size="lg" className="text-lg px-8">
              Browse All Anime
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </header>

        {/* Category Sections */}
        <div className="space-y-4">
          <Suspense fallback={<CategorySectionSkeleton />}>
            <NewestAnimeSection />
          </Suspense>

          <Suspense fallback={<CategorySectionSkeleton />}>
            <MostPopularSection />
          </Suspense>

          <Suspense fallback={<CategorySectionSkeleton />}>
            <LatestSeriesSection />
          </Suspense>

          <Suspense fallback={<CategorySectionSkeleton />}>
            <LatestMoviesSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

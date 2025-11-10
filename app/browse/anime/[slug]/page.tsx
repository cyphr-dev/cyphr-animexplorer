import { fetchAnimeById } from "@/lib/api/jikan";
import { Anime } from "@/lib/types/anime";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnimeDetailsSidebar } from "@/components/AnimeDetailsSidebar";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import AnimeDetailsHeader from "@/components/AnimeDetailsHeader";
import AnimeStatsGrid from "@/components/AnimeStatsGrid";
import { SmartAnimeTabs } from "@/components/SmartAnimeTabs";

interface AnimeDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: AnimeDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const animeId = parseInt(slug);

  if (isNaN(animeId)) {
    return {
      title: "Anime Not Found",
      description: "The anime you're looking for doesn't exist.",
    };
  }

  try {
    const anime: Anime = await fetchAnimeById(animeId);

    if (!anime) {
      return {
        title: "Anime Not Found",
        description: "The anime you're looking for doesn't exist.",
      };
    }

    const title = anime.title || anime.title_english || "Anime Details";
    const description =
      anime.synopsis?.substring(0, 160) ||
      `Explore details about ${title} on Anime Explorer.`;
    const imageUrl =
      anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;

    return {
      title,
      description,
      openGraph: {
        title: `${title} | Anime Explorer`,
        description,
        url: `/anime/${animeId}`,
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 225,
                height: 350,
                alt: title,
              },
            ]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Anime Explorer`,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {
      title: "Error Loading Anime",
      description: "There was an error loading the anime details.",
    };
  }
}

export default async function AnimeDetailsPage({
  params,
}: AnimeDetailsPageProps) {
  const { slug } = await params;
  const animeId = parseInt(slug);

  // Validate that the slug is a valid number
  if (isNaN(animeId)) {
    notFound();
  }

  let anime: Anime;

  try {
    // Only fetch the basic anime data during SSR
    anime = await fetchAnimeById(animeId);

    if (!anime) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return <AnimeEmptyState />;
  }

  return (
    <div className="container mx-auto bg-background">
      <div className="mx-auto px-4 pt-4 md:pt-8 space-y-6 grid grid-cols-1 md:grid-cols-11 gap-8">
        {/* Hero Section */}
        <div className="md:col-span-2">
          <AnimeDetailsSidebar anime={anime} />
        </div>
        <div className="md:col-span-7 flex flex-col gap-6">
          <AnimeDetailsHeader anime={anime} />

          {/* Lazy-loaded tabs */}
          <SmartAnimeTabs anime={anime} animeId={animeId} />
        </div>
        <div className="hidden md:block md:col-span-2">
          <div className="sticky top-26">
            <AnimeStatsGrid anime={anime} />
          </div>
        </div>
      </div>
    </div>
  );
}

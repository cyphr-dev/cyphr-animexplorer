import {
  fetchAnimeById,
  fetchAnimeRelations,
  fetchAnimeCharacters,
  fetchAnimePictures,
  fetchAnimeVideos,
  fetchAnimeStatistics,
} from "@/lib/api/jikan";
import {
  Anime,
  AnimeRelation,
  Character,
  AnimePicture,
  AnimeVideos,
  AnimeStatistics,
} from "@/lib/types/anime";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeDetailsSidebar } from "@/components/AnimeDetailsSidebar";
import { AnimeInfoTab } from "@/components/AnimeInfoTab";
import { AnimeMediaTab } from "@/components/AnimeMediaTab";
import { AnimeStatisticsTab } from "@/components/AnimeStatisticsTab";
import { AnimeRelatedTab } from "@/components/AnimeRelatedTab";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import AnimeDetailsHeader from "@/components/AnimeDetailsHeader";
import AnimeStatsGrid from "@/components/AnimeStatsGrid";

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
  let relations: AnimeRelation[] | null = null;
  const relatedAnimeData: Anime[] = [];
  let characters: Character[] = [];
  let pictures: AnimePicture[] = [];
  let videos: AnimeVideos | null = null;
  let statistics: AnimeStatistics | null = null;

  try {
    anime = await fetchAnimeById(animeId);

    if (!anime) {
      notFound();
    }

    // Fetch other data in parallel for faster SSR
    const [
      relationsResult,
      charactersResult,
      picturesResult,
      videosResult,
      statisticsResult,
    ] = await Promise.allSettled([
      fetchAnimeRelations(animeId),
      fetchAnimeCharacters(animeId),
      fetchAnimePictures(animeId),
      fetchAnimeVideos(animeId),
      fetchAnimeStatistics(animeId),
    ]);

    // Handle results
    if (relationsResult.status === "fulfilled") {
      relations = relationsResult.value;
    }
    if (charactersResult.status === "fulfilled") {
      characters = charactersResult.value;
    }
    if (picturesResult.status === "fulfilled") {
      pictures = picturesResult.value;
    }
    if (videosResult.status === "fulfilled") {
      videos = videosResult.value;
    }
    if (statisticsResult.status === "fulfilled") {
      statistics = statisticsResult.value;
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

          {/* Main Content Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
            </TabsList>

            {/* Info Tab */}
            <TabsContent value="info">
              <AnimeInfoTab anime={anime} characters={characters} />
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <AnimeMediaTab
                pictures={pictures}
                videos={videos}
                animeTitle={anime.title}
              />
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="statistics">
              <AnimeStatisticsTab statistics={statistics} />
            </TabsContent>

            {/* Related Tab */}
            <TabsContent value="related">
              <AnimeRelatedTab
                relations={relations}
                relatedAnimeData={relatedAnimeData}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="md:col-span-2">
          <div className="sticky top-26">
            <AnimeStatsGrid anime={anime} />
          </div>
        </div>
      </div>
    </div>
  );
}

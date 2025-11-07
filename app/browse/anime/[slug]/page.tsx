import {
  fetchAnimeById,
  fetchAnimeRelations,
  fetchAnimeByIds,
  fetchAnimeCharacters,
} from "@/lib/api/jikan";
import { Anime, AnimeRelation, Character } from "@/lib/types/anime";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Star,
  Calendar,
  Film,
  Clock,
  TrendingUp,
  Heart,
  Users,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "@/components/AnimeCard";
import Link from "next/link";
import AnimeEmptyState from "@/components/AnimeEmptyState";

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

  try {
    const anime: Anime = await fetchAnimeById(animeId);

    if (!anime) {
      notFound();
    }

    // Fetch relations data
    let relations: AnimeRelation[] | null = null;
    let relatedAnimeData: Anime[] = [];
    try {
      relations = await fetchAnimeRelations(animeId);

      // Extract all anime IDs from relations
      if (relations && relations.length > 0) {
        const animeIds = relations
          .flatMap((rel) => rel.entry)
          .filter((entry) => entry.type === "anime")
          .map((entry) => entry.mal_id);

        // Fetch anime data for images
        if (animeIds.length > 0) {
          const fetchedData = await fetchAnimeByIds(animeIds);
          // Filter out null/undefined values
          relatedAnimeData = fetchedData.filter(
            (anime): anime is Anime => anime !== null && anime !== undefined
          );
        }
      }
    } catch (error) {
      console.error("Error fetching relations:", error);
    }

    // Fetch characters data
    let characters: Character[] = [];
    try {
      characters = await fetchAnimeCharacters(animeId);
    } catch (error) {
      console.error("Error fetching characters:", error);
    }

    return (
      <div className="container min-h-screen mx-auto bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{anime.title}</span>
          </nav>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Poster */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden sticky top-26 p-0">
                <div className="relative aspect-3/4 w-full">
                  <Image
                    src={
                      anime.images.webp.large_image_url ||
                      anime.images.jpg.large_image_url
                    }
                    alt={anime.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
              </Card>
            </div>

            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Section */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {anime.title}
                </h1>
                {anime.title_english && anime.title_english !== anime.title && (
                  <p className="text-xl text-muted-foreground mb-2">
                    {anime.title_english}
                  </p>
                )}
                {anime.title_japanese && (
                  <p className="text-lg text-muted-foreground">
                    {anime.title_japanese}
                  </p>
                )}
              </div>

              {/* Genres Section */}
              {anime.genres && anime.genres.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <span
                        key={genre.mal_id}
                        className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm hover:bg-primary/20 transition-colors"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating and Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Score */}
                <Card>
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <Star className="w-8 h-8 fill-yellow-400 text-yellow-400 mb-2" />
                    <div className="text-2xl font-bold">
                      {anime.score ? anime.score.toFixed(1) : "N/A"}
                    </div>
                    <div className="text-sm text-muted-foreground">Score</div>
                    {anime.scored_by && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {anime.scored_by.toLocaleString()} users
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Rank */}
                {anime.rank && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center text-center">
                      <TrendingUp className="w-8 h-8 text-primary mb-2" />
                      <div className="text-2xl font-bold">#{anime.rank}</div>
                      <div className="text-sm text-muted-foreground">
                        Ranked
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Popularity */}
                <Card>
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <Users className="w-8 h-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">
                      #{anime.popularity}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Popularity
                    </div>
                  </CardContent>
                </Card>

                {/* Favorites */}
                <Card>
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <Heart className="w-8 h-8 text-red-500 mb-2" />
                    <div className="text-2xl font-bold">
                      {anime.favorites.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Favorites
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Info */}
              <Card>
                <CardContent className="">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {anime.type && (
                      <div className="flex items-start gap-3">
                        <Film className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Type
                          </div>
                          <div className="font-medium">{anime.type}</div>
                        </div>
                      </div>
                    )}

                    {anime.episodes && (
                      <div className="flex items-start gap-3">
                        <PlayCircle className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Episodes
                          </div>
                          <div className="font-medium">
                            {anime.episodes}{" "}
                            {anime.episodes === 1 ? "Episode" : "Episodes"}
                          </div>
                        </div>
                      </div>
                    )}

                    {anime.status && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Status
                          </div>
                          <div className="font-medium">{anime.status}</div>
                        </div>
                      </div>
                    )}

                    {anime.duration && (
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Duration
                          </div>
                          <div className="font-medium">{anime.duration}</div>
                        </div>
                      </div>
                    )}

                    {anime.aired?.string && (
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Aired
                          </div>
                          <div className="font-medium">
                            {anime.aired.string}
                          </div>
                        </div>
                      </div>
                    )}

                    {anime.rating && (
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Rating
                          </div>
                          <div className="font-medium">{anime.rating}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            {/* Trailer Section */}
            {anime.trailer?.embed_url && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={anime.trailer.embed_url}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${anime.title} Trailer`}
                />
              </div>
            )}

            {/* Synopsis Section */}
            {anime.synopsis && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h3>Synopsis</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {anime.synopsis}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Background Section */}
            {anime.background && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h3>Background</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {anime.background}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Additional Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <h3>Additional Information</h3>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {anime.source && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Source
                      </div>
                      <div className="font-medium">{anime.source}</div>
                    </div>
                  )}
                  {anime.season && anime.year && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Season
                      </div>
                      <div className="font-medium capitalize">
                        {anime.season} {anime.year}
                      </div>
                    </div>
                  )}
                  {anime.members && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Members
                      </div>
                      <div className="font-medium">
                        {anime.members.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Characters Section */}
            {characters && characters.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <h3>Characters & Voice Actors</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characters.slice(0, 12).map((char) => (
                      <div
                        key={char.character.mal_id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Character Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                            <Image
                              src={
                                char.character.images.webp.image_url ||
                                char.character.images.jpg.image_url
                              }
                              alt={char.character.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={char.character.url}
                              target="_blank"
                              className="font-medium hover:text-primary transition-colors line-clamp-1"
                            >
                              {char.character.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">
                              {char.role}
                            </p>
                          </div>
                        </div>

                        {/* Voice Actor Info */}
                        {char.voice_actors && char.voice_actors.length > 0 && (
                          <div className="flex items-center gap-3 flex-1 justify-end">
                            <div className="text-right min-w-0">
                              <Link
                                href={char.voice_actors[0].person.url}
                                target="_blank"
                                className="font-medium hover:text-primary transition-colors line-clamp-1 block"
                              >
                                {char.voice_actors[0].person.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {char.voice_actors[0].language}
                              </p>
                            </div>
                            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                              <Image
                                src={
                                  char.voice_actors[0].person.images.jpg
                                    .image_url
                                }
                                alt={char.voice_actors[0].person.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Relations Section - Seasons, Sequels, Prequels, etc. */}
            {relations &&
              relations.length > 0 &&
              relations.some((rel) =>
                rel.entry.some((entry) => entry.type === "anime")
              ) && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <h3>Related Anime</h3>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      defaultValue={
                        relations.find((rel) =>
                          rel.entry.some((entry) => entry.type === "anime")
                        )?.relation
                      }
                      className="w-full"
                    >
                      <TabsList className="w-full justify-start flex-wrap h-auto">
                        {relations.map((relation, index) => {
                          const animeEntries = relation.entry.filter(
                            (entry) => entry.type === "anime"
                          );
                          if (animeEntries.length === 0) return null;

                          return (
                            <TabsTrigger
                              key={index}
                              value={relation.relation}
                              className="capitalize"
                            >
                              {relation.relation}
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>

                      {relations.map((relation, index) => {
                        const animeEntries = relation.entry.filter(
                          (entry) => entry.type === "anime"
                        );

                        if (animeEntries.length === 0) return null;

                        return (
                          <TabsContent
                            key={index}
                            value={relation.relation}
                            className="mt-6"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {animeEntries.map((entry) => {
                                const animeData = relatedAnimeData.find(
                                  (a) => a.mal_id === entry.mal_id
                                );

                                // If we have the full anime data, use AnimeCard
                                if (animeData) {
                                  return (
                                    <AnimeCard
                                      key={entry.mal_id}
                                      anime={animeData}
                                    />
                                  );
                                }

                                // Fallback for when we don't have full anime data
                                return (
                                  <Link
                                    key={entry.mal_id}
                                    href={`/browse/anime/${entry.mal_id}`}
                                    className="group block"
                                  >
                                    <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                                      <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                          No Image
                                        </div>
                                      </div>
                                      <CardContent className="p-3">
                                        <h5 className="text-sm font-medium line-clamp-2">
                                          {entry.name}
                                        </h5>
                                      </CardContent>
                                    </Card>
                                  </Link>
                                );
                              })}
                            </div>
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return <AnimeEmptyState />;
  }
}

import { fetchAnimeById } from "@/lib/api/jikan";
import { Anime } from "@/lib/types/anime";
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
  Car,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import AnimeEmptyState from "@/components/AnimeEmptyState";

interface AnimeDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
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
    return (
      <div className="min-h-screen bg-background">
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
              <Card className="overflow-hidden sticky top-26">
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
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return <AnimeEmptyState />;
  }
}

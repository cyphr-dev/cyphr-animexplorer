"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anime } from "@/lib/types/anime";
import { Star, Heart, Calendar, Film } from "lucide-react";
import { useFavoritesStore } from "@/lib/store";

interface AnimeListCardProps {
  anime: Anime;
}

export function AnimeListCard({ anime }: AnimeListCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isAnimeFavorite = isFavorite(anime.mal_id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAnimeFavorite) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  };

  return (
    <Link href={`/browse/anime/${anime.mal_id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer mb-4">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            <div className="relative w-full sm:w-32 aspect-3/4 sm:aspect-auto sm:h-44 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image
                src={
                  anime.images.webp.large_image_url ||
                  anime.images.jpg.large_image_url
                }
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 128px"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                    {anime.title}
                  </h3>
                  {anime.title_english &&
                    anime.title_english !== anime.title && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {anime.title_english}
                      </p>
                    )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isAnimeFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Synopsis */}
              {anime.synopsis && (
                <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3">
                  {anime.synopsis}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap gap-3 mt-auto text-sm">
                {anime.score && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">
                      {anime.score.toFixed(1)}
                    </span>
                  </div>
                )}

                {anime.type && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Film className="w-4 h-4" />
                    <span>{anime.type}</span>
                  </div>
                )}

                {anime.episodes && (
                  <span className="text-muted-foreground">
                    {anime.episodes}{" "}
                    {anime.episodes === 1 ? "Episode" : "Episodes"}
                  </span>
                )}

                {anime.year && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{anime.year}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {anime.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {anime.genres.length > 3 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{anime.genres.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

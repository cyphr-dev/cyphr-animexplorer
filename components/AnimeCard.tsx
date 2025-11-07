"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Anime } from "@/lib/types/anime";
import { Star, Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/store";

interface AnimeCardProps {
  anime: Anime;
  isLoading?: boolean;
}

export function AnimeCard({ anime, isLoading = false }: AnimeCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isAnimeFavorite = isFavorite(anime.mal_id);

  if (isLoading) {
    return <AnimeCardSkeleton />;
  }

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
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer relative group p-0 gap-0">
        <CardHeader className="p-0">
          <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
            <Image
              src={
                anime.images.webp.large_image_url ||
                anime.images.jpg.large_image_url
              }
              alt={anime.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Favorite Button */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-8 w-8"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={`w-4 h-4 ${
                  isAnimeFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 space-y-1">
          <h4 className="line-clamp-1">{anime.title}</h4>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {anime.type && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">
                {anime.type}
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {anime.score ? anime.score.toFixed(1) : "N/A"}
            </span>
          </div>
          {anime.episodes && (
            <span className="text-sm text-muted-foreground">
              {anime.episodes} {anime.episodes === 1 ? "Ep" : "Eps"}
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="aspect-3/4 w-full" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-20 mt-3 rounded-md" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-24" />
      </CardFooter>
    </Card>
  );
}

export function AnimeListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  );
}

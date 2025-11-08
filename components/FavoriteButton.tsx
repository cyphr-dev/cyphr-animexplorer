"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { Anime } from "@/lib/types/anime";

interface FavoriteButtonProps {
  anime: Anime;
}

export function FavoriteButton({ anime }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const isInFavorites = isFavorite(anime.mal_id);

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFavorite(anime.mal_id);
    } else {
      addFavorite(anime);
    }
  };

  return (
    <Button
      onClick={handleToggleFavorite}
      variant={isInFavorites ? "default" : "outline"}
      size="lg"
      className="w-full"
    >
      <Heart
        className={`w-5 h-5 ${
          isInFavorites ? "fill-current text-white" : "text-current"
        }`}
      />
      <p className="inline-block md:hidden lg:inline-block">
        {isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
      </p>
    </Button>
  );
}

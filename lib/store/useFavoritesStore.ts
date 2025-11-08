import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { FavoritesState, FavoriteAnime } from "../types/store";
import { Anime } from "../types/anime";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (anime: Anime) => {
        const favoriteAnime: FavoriteAnime = {
          mal_id: anime.mal_id,
          title: anime.title,
          images: anime.images,
          score: anime.score,
          episodes: anime.episodes,
          type: anime.type,
          status: anime.status,
          genres: anime.genres,
          synopsis: anime.synopsis,
          addedAt: Date.now(),
        };

        set((state) => ({
          favorites: [...state.favorites, favoriteAnime],
        }));

        toast.success(`Added "${anime.title}" to favorites! ❤️`, {
          // description: "You can view all your favorites in the Favorites page",
          duration: 3000,
        });
      },

      removeFavorite: (malId: number) => {
        const anime = get().favorites.find((a) => a.mal_id === malId);

        set((state) => ({
          favorites: state.favorites.filter((anime) => anime.mal_id !== malId),
        }));

        if (anime) {
          toast.success(`Removed "${anime.title}" from favorites! 💔`, {
            // description: "The anime has been removed from your favorites list",
            duration: 3000,
          });
        }
      },

      isFavorite: (malId: number) => {
        return get().favorites.some((anime) => anime.mal_id === malId);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "anime-favorites-storage",
    }
  )
);

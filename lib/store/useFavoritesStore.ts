import { create } from "zustand";
import { persist } from "zustand/middleware";
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
      },

      removeFavorite: (malId: number) => {
        set((state) => ({
          favorites: state.favorites.filter((anime) => anime.mal_id !== malId),
        }));
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

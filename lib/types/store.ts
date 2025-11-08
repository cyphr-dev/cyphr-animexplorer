import { Anime } from "./anime";

// Favorites Store Types
export interface FavoriteAnime {
  mal_id: number;
  title: string;
  images: Anime["images"];
  score: number | null;
  episodes: number | null;
  type: string | null;
  status: string | null;
  genres: Array<{ mal_id: number; name: string; type: string; url: string }>;
  synopsis: string | null;
  addedAt: number; // timestamp
}

export interface FavoritesState {
  favorites: FavoriteAnime[];
  addFavorite: (anime: Anime) => void;
  removeFavorite: (malId: number) => void;
  isFavorite: (malId: number) => boolean;
  clearFavorites: () => void;
}

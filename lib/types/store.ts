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

// Search & Filter Store Types
export interface FilterState {
  searchQuery: string;
  selectedGenre: string | null;
  selectedType: string | null;
  selectedStatus: string | null;
  minScore: number | null;
  setSearchQuery: (query: string) => void;
  setSelectedGenre: (genre: string | null) => void;
  setSelectedType: (type: string | null) => void;
  setSelectedStatus: (status: string | null) => void;
  setMinScore: (score: number | null) => void;
  clearFilters: () => void;
}

// Pagination Store Types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  setCurrentPage: (page: number) => void;
  setTotalPages: (total: number) => void;
  setHasNextPage: (hasNext: boolean) => void;
  resetPagination: () => void;
}

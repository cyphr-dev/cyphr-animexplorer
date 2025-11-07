import { create } from "zustand";
import { FilterState } from "../types/store";

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  selectedGenre: null,
  selectedType: null,
  selectedStatus: null,
  minScore: null,

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedGenre: (genre: string | null) => {
    set({ selectedGenre: genre });
  },

  setSelectedType: (type: string | null) => {
    set({ selectedType: type });
  },

  setSelectedStatus: (status: string | null) => {
    set({ selectedStatus: status });
  },

  setMinScore: (score: number | null) => {
    set({ minScore: score });
  },

  clearFilters: () => {
    set({
      searchQuery: "",
      selectedGenre: null,
      selectedType: null,
      selectedStatus: null,
      minScore: null,
    });
  },
}));

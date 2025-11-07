import { create } from "zustand";
import { PaginationState } from "../types/store";

export const usePaginationStore = create<PaginationState>((set) => ({
  currentPage: 1,
  totalPages: 1,
  hasNextPage: false,

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
  },

  setTotalPages: (total: number) => {
    set({ totalPages: total });
  },

  setHasNextPage: (hasNext: boolean) => {
    set({ hasNextPage: hasNext });
  },

  resetPagination: () => {
    set({
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
    });
  },
}));

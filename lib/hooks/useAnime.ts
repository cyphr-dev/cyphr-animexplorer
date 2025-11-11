import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchAnimeList,
  fetchAnimeById,
  fetchTopAnime,
  fetchCurrentlyAiring,
  fetchGenres,
  fetchAnimeRelations,
  fetchAnimeCharacters,
  fetchAnimePictures,
  fetchAnimeVideos,
  fetchAnimeStatistics,
  FetchAnimeParams,
} from "@/lib/api/jikan";

// Query keys for consistent caching
export const animeKeys = {
  all: ["anime"] as const,
  lists: () => [...animeKeys.all, "list"] as const,
  list: (params: FetchAnimeParams) => [...animeKeys.lists(), params] as const,
  details: () => [...animeKeys.all, "detail"] as const,
  detail: (id: number) => [...animeKeys.details(), id] as const,
  relations: (id: number) => [...animeKeys.detail(id), "relations"] as const,
  relatedAnime: (ids: number[]) =>
    [...animeKeys.all, "related", ids.sort().join(",")] as const,
  characters: (id: number) => [...animeKeys.detail(id), "characters"] as const,
  pictures: (id: number) => [...animeKeys.detail(id), "pictures"] as const,
  videos: (id: number) => [...animeKeys.detail(id), "videos"] as const,
  statistics: (id: number) => [...animeKeys.detail(id), "statistics"] as const,
  top: (filter?: string) => [...animeKeys.all, "top", filter] as const,
  airing: () => [...animeKeys.all, "airing"] as const,
  genres: () => ["genres"] as const,
};

// Hook for fetching anime list with pagination
export function useAnimeList(params: FetchAnimeParams = {}) {
  return useQuery({
    queryKey: animeKeys.list(params),
    queryFn: () => fetchAnimeList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for infinite anime list (for infinite scroll)
export function useInfiniteAnimeList(params: Omit<FetchAnimeParams, "page">) {
  return useInfiniteQuery({
    queryKey: animeKeys.list(params),
    queryFn: ({ pageParam = 1 }) =>
      fetchAnimeList({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.has_next_page) {
        return lastPage.pagination.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook for fetching anime details
export function useAnimeDetails(id: number) {
  return useQuery({
    queryKey: animeKeys.detail(id),
    queryFn: () => fetchAnimeById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes (details change less frequently)
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!id && id > 0,
  });
}

// Hook for fetching top anime
export function useTopAnime(
  filter?: "airing" | "upcoming" | "bypopularity" | "favorite"
) {
  return useQuery({
    queryKey: animeKeys.top(filter),
    queryFn: () => fetchTopAnime(filter),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// Hook for fetching currently airing anime
export function useCurrentlyAiring() {
  return useQuery({
    queryKey: animeKeys.airing(),
    queryFn: fetchCurrentlyAiring,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}

// Hook for fetching genres (rarely changes)
export function useGenres() {
  return useQuery({
    queryKey: animeKeys.genres(),
    queryFn: fetchGenres,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Hook for anime relations
export function useAnimeRelations(id: number) {
  return useQuery({
    queryKey: animeKeys.relations(id),
    queryFn: () => fetchAnimeRelations(id),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!id && id > 0,
  });
}

// Hook for anime characters
export function useAnimeCharacters(id: number) {
  return useQuery({
    queryKey: animeKeys.characters(id),
    queryFn: () => fetchAnimeCharacters(id),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!id && id > 0,
  });
}

// Hook for anime pictures
export function useAnimePictures(id: number) {
  return useQuery({
    queryKey: animeKeys.pictures(id),
    queryFn: () => fetchAnimePictures(id),
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!id && id > 0,
  });
}

// Hook for anime videos
export function useAnimeVideos(id: number) {
  return useQuery({
    queryKey: animeKeys.videos(id),
    queryFn: () => fetchAnimeVideos(id),
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!id && id > 0,
  });
}

// Hook for anime statistics
export function useAnimeStatistics(id: number) {
  return useQuery({
    queryKey: animeKeys.statistics(id),
    queryFn: () => fetchAnimeStatistics(id),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: !!id && id > 0,
  });
}

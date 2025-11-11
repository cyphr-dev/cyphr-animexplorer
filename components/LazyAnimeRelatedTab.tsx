"use client";

import { useQuery } from "@tanstack/react-query";
import { AnimeRelation } from "@/lib/types/anime";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "./ui/badge";
import { AnimeListCard } from "@/components/AnimeListCard";
import { fetchAnimeByIds } from "@/lib/api/jikan";
import { animeKeys } from "@/lib/hooks/useAnime";

interface LazyAnimeRelatedTabProps {
  relations: AnimeRelation[] | null;
  isLoading: boolean;
  error?: Error | null;
}

export function LazyAnimeRelatedTab({
  relations,
  isLoading,
  error,
}: LazyAnimeRelatedTabProps) {
  // Extract all anime IDs from relations
  const animeIds =
    relations
      ?.flatMap((rel) =>
        rel.entry.filter((e) => e.type === "anime").map((e) => e.mal_id)
      )
      .slice(0, 20) || []; // Limit to 20 to avoid too many requests

  // Fetch full anime data for related anime
  const {
    data: relatedAnimeData = [],
    isLoading: animeDataLoading,
    error: animeDataError,
  } = useQuery({
    queryKey: animeKeys.relatedAnime(animeIds),
    queryFn: () => fetchAnimeByIds(animeIds),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: animeIds.length > 0 && !isLoading && !error,
  });

  if (isLoading || animeDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <h3>Related Anime</h3>

          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3">
                <Skeleton className="w-16 h-20 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || animeDataError) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Failed to load related anime data.</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!relations || relations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No related anime found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {relations.map((relation, index) => {
        // Filter only anime entries
        const animeEntries = relation.entry.filter((e) => e.type === "anime");

        if (animeEntries.length === 0) return null;

        return (
          <div key={index}>
            <div className="flex flex-col gap-6">
              <h3 className="capitalize items-center flex gap-2">
                {relation.relation} <Badge>{animeEntries.length}</Badge>
              </h3>

              <div className="space-y-4">
                {animeEntries.map((entry) => {
                  // Find the full anime data for this entry
                  const animeData = relatedAnimeData.find(
                    (a) => a.mal_id === entry.mal_id
                  );

                  // If we have full anime data, use AnimeListCard
                  if (animeData) {
                    return (
                      <AnimeListCard key={entry.mal_id} anime={animeData} />
                    );
                  }

                  // Fallback: show basic info if full data isn't available
                  return (
                    <div
                      key={entry.mal_id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="relative w-16 h-20 rounded overflow-hidden bg-muted shrink-0">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No Image
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium line-clamp-2">
                          {entry.name}
                        </h5>
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {entry.type}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {index < relations.length - 1 && <hr />}
          </div>
        );
      })}
    </div>
  );
}

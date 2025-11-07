"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimeCard } from "@/components/AnimeCard";
import { fetchAnimeList } from "@/lib/api/jikan";
import { Anime } from "@/lib/types/anime";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import AnimeEmptyState from "@/components/AnimeEmptyState";

interface InfiniteScrollAnimeListProps {
  initialData: Anime[];
  initialPage: number;
}

export default function InfiniteScrollAnimeList({
  initialData,
  initialPage,
}: InfiniteScrollAnimeListProps) {
  const [animeList, setAnimeList] = useState<Anime[]>(initialData);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const data = await fetchAnimeList({ page: nextPage, limit: 20 });

      if (data.data && data.data.length > 0) {
        // Filter out duplicates based on mal_id
        const existingIds = new Set(animeList.map((anime) => anime.mal_id));
        const newAnime = data.data.filter(
          (anime) => !existingIds.has(anime.mal_id)
        );

        setAnimeList((prev) => [...prev, ...newAnime]);
        setPage(nextPage);
        setHasMore(data.pagination.has_next_page);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more anime:", err);
      setError("Failed to load more anime. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, animeList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loading]);

  if (animeList.length === 0 && !loading) {
    return (
      <AnimeEmptyState
        title="No Anime Found"
        description="The anime you're looking for doesn't exist or has been removed."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {animeList.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            Loading more anime...
          </span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* End of content message */}
      {!hasMore && !loading && animeList.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>You&apos;ve reached the end! 🎉</p>
          <p className="text-sm mt-2">Loaded {animeList.length} anime</p>
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />
    </>
  );
}

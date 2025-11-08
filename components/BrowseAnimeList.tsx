"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeListCard } from "@/components/AnimeListCard";
import { fetchAnimeList } from "@/lib/api/jikan";
import { Anime } from "@/lib/types/anime";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { Button } from "@/components/ui/button";
import AnimeSearchBar from "@/components/AnimeSearchBar";
import {
  AlertCircle,
  Loader2,
  Filter,
  Search,
  Grid3x3,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "./ui/card";

interface BrowseAnimeListProps {
  initialData: Anime[];
  initialPage: number;
  initialGenres: Array<{ mal_id: number; name: string }>;
}

export default function BrowseAnimeList({
  initialData,
  initialPage,
  initialGenres,
}: BrowseAnimeListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [animeList, setAnimeList] = useState<Anime[]>(initialData);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid"
  );
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(
    searchParams.get("infinite_scroll") !== "false"
  );
  const [sfwMode, setSfwMode] = useState(
    searchParams.get("sfw") !== "false" // SFW enabled by default
  );

  // Initialize filter states from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("q") || ""
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams.get("type") || "none"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>(
    searchParams.get("status") || "none"
  );
  const [selectedRating, setSelectedRating] = useState<string>(
    searchParams.get("rating") || "none"
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get("genres")
      ? searchParams.get("genres")!.split(",").map(Number)
      : []
  );
  const [minScore, setMinScore] = useState<string>(
    searchParams.get("min_score") || "none"
  );
  const [orderBy, setOrderBy] = useState<string>(
    searchParams.get("order_by") || "popularity"
  );
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams.get("sort") || "asc"
  );

  const observerTarget = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Function to update URL params
  const updateURLParams = useCallback(
    (params: Record<string, string | number | null | undefined>) => {
      const newParams = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });

      const newUrl = `${pathname}?${newParams.toString()}`;
      const currentUrl = `${pathname}${window.location.search}`;

      // Only update if URL actually changed
      if (newUrl !== currentUrl) {
        router.push(newUrl, { scroll: false });
      }
    },
    [pathname, router]
  );

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const fetchWithFilters = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      setLoading(true);
      setError(null);

      try {
        const typeValue =
          selectedType && selectedType !== "none" ? selectedType : undefined;
        const statusValue =
          selectedStatus && selectedStatus !== "none"
            ? selectedStatus
            : undefined;
        const ratingValue =
          selectedRating && selectedRating !== "none"
            ? selectedRating
            : undefined;
        const minScoreValue =
          minScore && minScore !== "none" ? parseFloat(minScore) : undefined;

        const data = await fetchAnimeList({
          page: pageNum,
          limit: 20,
          q: debouncedSearch || undefined,
          type: typeValue as
            | "tv"
            | "movie"
            | "ova"
            | "special"
            | "ona"
            | "music"
            | undefined,
          status: statusValue as "airing" | "complete" | "upcoming" | undefined,
          rating: ratingValue as
            | "g"
            | "pg"
            | "pg13"
            | "r17"
            | "r"
            | "rx"
            | undefined,
          sfw: sfwMode, // Filter out hentai content when enabled
          genres:
            selectedGenres.length > 0 ? selectedGenres.join(",") : undefined,
          min_score: minScoreValue,
          order_by: orderBy as
            | "mal_id"
            | "title"
            | "start_date"
            | "end_date"
            | "episodes"
            | "score"
            | "scored_by"
            | "rank"
            | "popularity"
            | "members"
            | "favorites"
            | undefined,
          sort: sortOrder as "asc" | "desc" | undefined,
        });

        if (data.data && data.data.length > 0) {
          if (reset) {
            setAnimeList(data.data);
          } else {
            setAnimeList((prev) => {
              const existingIds = new Set(prev.map((anime) => anime.mal_id));
              const newAnime = data.data.filter(
                (anime) => !existingIds.has(anime.mal_id)
              );
              return [...prev, ...newAnime];
            });
          }

          setPage(pageNum);
          setHasMore(data.pagination.has_next_page);
        } else {
          setHasMore(false);
          if (reset) {
            setAnimeList([]);
          }
        }
      } catch (err) {
        console.error("Error loading anime:", err);
        setError("Failed to load anime. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [
      debouncedSearch,
      selectedType,
      selectedStatus,
      selectedRating,
      selectedGenres,
      minScore,
      orderBy,
      sortOrder,
      sfwMode,
    ]
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setAnimeList([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchWithFilters(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    selectedType,
    selectedStatus,
    selectedRating,
    selectedGenres,
    minScore,
    orderBy,
    sortOrder,
    sfwMode,
  ]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchWithFilters(page + 1);
  }, [page, loading, hasMore, fetchWithFilters]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    // Only set up observer if infinite scroll is enabled
    if (!infiniteScrollEnabled) return;

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
  }, [loadMore, hasMore, loading, infiniteScrollEnabled]);

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) => {
      const newGenres = prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId];

      // Update URL with new genres
      updateURLParams({
        genres: newGenres.length > 0 ? newGenres.join(",") : null,
      });

      return newGenres;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedStatus("");
    setSelectedRating("");
    setSelectedGenres([]);
    setMinScore("");

    // Clear all filter params from URL
    router.push(pathname, { scroll: false });
  };

  // Update URL when filters change
  useEffect(() => {
    updateURLParams({
      q: debouncedSearch || null,
      type: selectedType || null,
      status: selectedStatus || null,
      rating: selectedRating || null,
      genres: selectedGenres.length > 0 ? selectedGenres.join(",") : null,
      min_score: minScore || null,
      order_by: orderBy !== "popularity" ? orderBy : null,
      sort: sortOrder !== "asc" ? sortOrder : null,
      view: viewMode !== "grid" ? viewMode : null,
      infinite_scroll: !infiniteScrollEnabled ? "false" : null,
      sfw: !sfwMode ? "false" : null, // Only add to URL when disabled
    });
  }, [
    debouncedSearch,
    selectedType,
    selectedStatus,
    selectedRating,
    selectedGenres,
    minScore,
    orderBy,
    sortOrder,
    viewMode,
    infiniteScrollEnabled,
    sfwMode,
    updateURLParams,
  ]);

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedType ||
      selectedStatus ||
      selectedRating ||
      selectedGenres.length > 0 ||
      minScore
  );

  const browseSortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "score", label: "Score" },
    { value: "title", label: "Title" },
    { value: "start_date", label: "Start Date" },
    { value: "end_date", label: "End Date" },
    { value: "favorites", label: "Favorites" },
  ];

  return (
    <div className="space-y-6">
      {/* Mobile Search and Controls */}
      <Card className="lg:hidden sticky top-22 bg-gray-100 dark:bg-gray-800 py-4 px-0 z-10">
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              className="pl-9"
            />
          </div>

          {/* Controls Row */}
          <div className="flex gap-2">
            {/* View Toggle */}
            <div
              className="inline-flex rounded-full shadow-sm flex-1"
              role="group"
            >
              <Button
                type="button"
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                className="rounded-r-none w-1/2"
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                <span>Grid</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="rounded-l-none w-1/2"
              >
                <List className="w-4 h-4 mr-2" />
                <span>List</span>
              </Button>
            </div>

            {/* Filters Sheet Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="px-3">
                  <Filter className="w-4 h-4" />
                  {hasActiveFilters && (
                    <span className="ml-1 bg-primary text-primary-foreground rounded-full w-2 h-2"></span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader></SheetHeader>
                <div className="mt-6 overflow-y-scroll">
                  <AnimeSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search anime..."
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                    showTypeFilter={true}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    showStatusFilter={true}
                    selectedRating={selectedRating}
                    onRatingChange={setSelectedRating}
                    showRatingFilter={true}
                    minScore={minScore}
                    onMinScoreChange={setMinScore}
                    showMinScoreFilter={true}
                    orderBy={orderBy}
                    onOrderByChange={setOrderBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    sortOptions={browseSortOptions}
                    selectedGenres={selectedGenres}
                    onGenreToggle={handleGenreToggle}
                    availableGenres={initialGenres}
                    showGenreFilter={true}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    infiniteScrollEnabled={infiniteScrollEnabled}
                    onInfiniteScrollToggle={() =>
                      setInfiniteScrollEnabled(!infiniteScrollEnabled)
                    }
                    showInfiniteScrollToggle={true}
                    sfwMode={sfwMode}
                    onSfwToggle={() => setSfwMode(!sfwMode)}
                    showSfwToggle={true}
                    onClearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                    isInSheet={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      <div className="grid col-span-1 md:grid-cols-10 gap-6">
        {/* Desktop Search and Filters */}
        <div className="hidden lg:block col-span-2">
          <AnimeSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search anime..."
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            showTypeFilter={true}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            showStatusFilter={true}
            selectedRating={selectedRating}
            onRatingChange={setSelectedRating}
            showRatingFilter={true}
            minScore={minScore}
            onMinScoreChange={setMinScore}
            showMinScoreFilter={true}
            orderBy={orderBy}
            onOrderByChange={setOrderBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            sortOptions={browseSortOptions}
            selectedGenres={selectedGenres}
            onGenreToggle={handleGenreToggle}
            availableGenres={initialGenres}
            showGenreFilter={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            infiniteScrollEnabled={infiniteScrollEnabled}
            onInfiniteScrollToggle={() =>
              setInfiniteScrollEnabled(!infiniteScrollEnabled)
            }
            showInfiniteScrollToggle={true}
            sfwMode={sfwMode}
            onSfwToggle={() => setSfwMode(!sfwMode)}
            showSfwToggle={true}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        <div className="col-span-1 md:col-span-10 lg:col-span-8">
          {/* Results */}
          {animeList.length === 0 && !loading && (
            <AnimeEmptyState
              title="No Anime Found"
              description={
                hasActiveFilters
                  ? "Try adjusting your filters to see more results."
                  : "No anime available at the moment."
              }
            >
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </AnimeEmptyState>
          )}

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {animeList.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {animeList.map((anime) => (
                <AnimeListCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading more anime...
              </span>
            </div>
          )}

          {/* Load More Button (when infinite scroll is disabled) */}
          {!infiniteScrollEnabled &&
            hasMore &&
            !loading &&
            animeList.length > 0 && (
              <div className="flex justify-center py-8">
                <Button onClick={loadMore} size="lg">
                  Load More
                </Button>
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

          {/* Intersection observer target (only when infinite scroll is enabled) */}
          {infiniteScrollEnabled && (
            <div ref={observerTarget} className="h-4" />
          )}
        </div>
      </div>
    </div>
  );
}

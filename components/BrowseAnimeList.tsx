"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeListCard } from "@/components/AnimeListCard";
import { useInfiniteAnimeList, useGenres } from "@/lib/hooks/useAnime";
import { FetchAnimeParams } from "@/lib/api/jikan";
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
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "./ui/card";

export default function BrowseAnimeList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // Build query params for React Query
  const queryParams = useMemo(() => {
    const params: Omit<FetchAnimeParams, "page"> = {
      limit: 20,
    };

    if (debouncedSearch) params.q = debouncedSearch;
    if (selectedType && selectedType !== "none") {
      params.type = selectedType as FetchAnimeParams["type"];
    }
    if (selectedStatus && selectedStatus !== "none") {
      params.status = selectedStatus as FetchAnimeParams["status"];
    }
    if (selectedRating && selectedRating !== "none") {
      params.rating = selectedRating as FetchAnimeParams["rating"];
    }
    if (selectedGenres.length > 0) params.genres = selectedGenres.join(",");
    if (minScore && minScore !== "none")
      params.min_score = parseFloat(minScore);
    params.sfw = sfwMode;
    if (orderBy) params.order_by = orderBy as FetchAnimeParams["order_by"];
    if (sortOrder) params.sort = sortOrder as FetchAnimeParams["sort"];

    return params;
  }, [
    debouncedSearch,
    selectedType,
    selectedStatus,
    selectedRating,
    selectedGenres,
    minScore,
    sfwMode,
    orderBy,
    sortOrder,
  ]);

  // Use React Query hooks
  const {
    data: animeData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAnimeList(queryParams);

  const { data: genres = [] } = useGenres();

  // Flatten the pages data
  const animeList = useMemo(() => {
    return animeData?.pages.flatMap((page) => page.data) || [];
  }, [animeData]);

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

  const loadMore = useCallback(async () => {
    if (!isFetchingNextPage && hasNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    // Only set up observer if infinite scroll is enabled
    if (!infiniteScrollEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
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
  }, [loadMore, hasNextPage, isFetchingNextPage, infiniteScrollEnabled]);

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
    setSelectedType("none");
    setSelectedStatus("none");
    setSelectedRating("none");
    setSelectedGenres([]);
    setMinScore("none");

    // Clear all filter params from URL
    router.push(pathname, { scroll: false });
  };

  // Update URL when filters change
  useEffect(() => {
    updateURLParams({
      q: debouncedSearch || null,
      type: selectedType !== "none" ? selectedType : null,
      status: selectedStatus !== "none" ? selectedStatus : null,
      rating: selectedRating !== "none" ? selectedRating : null,
      genres: selectedGenres.length > 0 ? selectedGenres.join(",") : null,
      min_score: minScore !== "none" ? minScore : null,
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
      (selectedType && selectedType !== "none") ||
      (selectedStatus && selectedStatus !== "none") ||
      (selectedRating && selectedRating !== "none") ||
      selectedGenres.length > 0 ||
      (minScore && minScore !== "none")
  );

  const browseSortOptions = [
    { value: "popularity", label: "Popularity" },
    { value: "score", label: "Score" },
    { value: "title", label: "Title" },
    { value: "start_date", label: "Start Date" },
    { value: "end_date", label: "End Date" },
    { value: "favorites", label: "Favorites" },
  ];

  // Show loading state for initial load
  if (isLoading && !animeList.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading anime...</span>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <AnimeEmptyState
        title="Unable to Load Anime Data"
        description="Failed to load anime data. Please try again later."
        icon={<AlertCircle className="w-24 h-24 text-destructive" />}
      />
    );
  }

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
                    availableGenres={genres}
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
            availableGenres={genres}
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
          {animeList.length === 0 && !isLoading && (
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
          {(isLoading || isFetchingNextPage) && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading more anime...
              </span>
            </div>
          )}

          {/* Load More Button (when infinite scroll is disabled) */}
          {!infiniteScrollEnabled &&
            hasNextPage &&
            !isFetchingNextPage &&
            animeList.length > 0 && (
              <div className="flex justify-center py-8">
                <Button onClick={loadMore} size="lg">
                  Load More
                </Button>
              </div>
            )}

          {/* Error message */}
          {isError && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load anime. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* End of content message */}
          {!hasNextPage && !isLoading && animeList.length > 0 && (
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

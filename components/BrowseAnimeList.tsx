"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeListCard } from "@/components/AnimeListCard";
import { fetchAnimeList } from "@/lib/api/jikan";
import { Anime } from "@/lib/types/anime";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Loader2,
  Grid3x3,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
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
  const [animeList, setAnimeList] = useState<Anime[]>(initialData);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minScore, setMinScore] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("popularity");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const observerTarget = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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
  ]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    await fetchWithFilters(page + 1);
  }, [page, loading, hasMore, fetchWithFilters]);

  // Intersection observer for infinite scroll
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

  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedStatus("");
    setSelectedRating("");
    setSelectedGenres([]);
    setMinScore("");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType ||
    selectedStatus ||
    selectedRating ||
    selectedGenres.length > 0 ||
    minScore;

  return (
    <>
      {/* Search and Filters */}
      <Card className="mb-6 space-y-4 sticky top-25 bg-gray-100/85 dark:bg-gray-800/85 sm:rounded-2xl items-center text-center z-50 backdrop-blur-md p-4">
        <CardContent className="grid grid-cols-5 gap-3">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 col-span-5">
            <div className="relative flex-1">
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

            {/* View Toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <Button
                type="button"
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="col-span-5 flex flex-row flex-wrap gap-2 items-center self-center">
            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Types</SelectItem>
                <SelectItem value="tv">TV</SelectItem>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="ova">OVA</SelectItem>
                <SelectItem value="special">Special</SelectItem>
                <SelectItem value="ona">ONA</SelectItem>
                <SelectItem value="music">Music</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Status</SelectItem>
                <SelectItem value="airing">Airing</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>

            {/* Rating Filter */}
            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Ratings</SelectItem>
                <SelectItem value="g">G - All Ages</SelectItem>
                <SelectItem value="pg">PG - Children</SelectItem>
                <SelectItem value="pg13">PG-13 - Teens 13+</SelectItem>
                <SelectItem value="r17">R - 17+</SelectItem>
                <SelectItem value="r">R+ - Mild Nudity</SelectItem>
                <SelectItem value="rx">Rx - Hentai</SelectItem>
              </SelectContent>
            </Select>

            {/* Min Score */}
            <Select value={minScore} onValueChange={setMinScore}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Min Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any Score</SelectItem>
                <SelectItem value="5">5.0+</SelectItem>
                <SelectItem value="6">6.0+</SelectItem>
                <SelectItem value="7">7.0+</SelectItem>
                <SelectItem value="8">8.0+</SelectItem>
                <SelectItem value="9">9.0+</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort By */}
            <Select value={orderBy} onValueChange={setOrderBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="start_date">Start Date</SelectItem>
                <SelectItem value="end_date">End Date</SelectItem>
                <SelectItem value="favorites">Favorites</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>

            {/* Genre Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Genres
                  {selectedGenres.length > 0 && (
                    <Badge className="ml-2" variant="secondary">
                      {selectedGenres.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-[400px] overflow-y-auto">
                <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {initialGenres.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre.mal_id}
                    checked={selectedGenres.includes(genre.mal_id)}
                    onCheckedChange={() => handleGenreToggle(genre.mal_id)}
                  >
                    {genre.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}

            {/* Active Filters Display */}
            {selectedGenres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedGenres.map((genreId) => {
                  const genre = initialGenres.find((g) => g.mal_id === genreId);
                  return (
                    <Badge key={genreId} variant="secondary">
                      {genre?.name}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => handleGenreToggle(genreId)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {animeList.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No anime found</p>
          {hasActiveFilters && (
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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

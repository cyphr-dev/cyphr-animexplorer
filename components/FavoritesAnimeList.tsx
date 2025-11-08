"use client";

import { useState, useMemo } from "react";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeListCard } from "@/components/AnimeListCard";
import { useFavoritesStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import AnimeSearchBar from "@/components/AnimeSearchBar";
import { Trash2, Heart, Filter, Search, Grid3x3, List } from "lucide-react";
import { Anime } from "@/lib/types/anime";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";

interface FavoritesAnimeListProps {
  initialGenres: Array<{ mal_id: number; name: string }>;
}

export default function FavoritesAnimeList({
  initialGenres,
}: FavoritesAnimeListProps) {
  const { favorites, clearFavorites } = useFavoritesStore();

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minScore, setMinScore] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("addedAt");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  // Convert favorites to Anime objects
  const favoriteAnimeList: (Anime & { addedAt: number })[] = useMemo(() => {
    return favorites.map((fav) => ({
      mal_id: fav.mal_id,
      title: fav.title,
      images: fav.images,
      score: fav.score,
      episodes: fav.episodes,
      type: fav.type,
      url: `https://myanimelist.net/anime/${fav.mal_id}`,
      trailer: { youtube_id: null, url: null, embed_url: null },
      approved: true,
      titles: [{ type: "Default", title: fav.title }],
      title_english: null,
      title_japanese: null,
      source: "",
      status: fav.status || "",
      airing: false,
      aired: {
        from: "",
        to: null,
        prop: {
          from: { day: 0, month: 0, year: 0 },
          to: { day: 0, month: 0, year: 0 },
        },
        string: "",
      },
      duration: "",
      rating: "",
      scored_by: null,
      rank: null,
      popularity: 0,
      members: 0,
      favorites: 0,
      synopsis: fav.synopsis || null,
      background: null,
      season: null,
      year: null,
      genres: fav.genres || [],
      // Store the addedAt timestamp for sorting
      addedAt: fav.addedAt,
    })) as (Anime & { addedAt: number })[];
  }, [favorites]);

  // Filter and sort anime
  const filteredAnimeList = useMemo(() => {
    let filtered = [...favoriteAnimeList];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((anime) =>
        anime.title.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType && selectedType !== "none") {
      filtered = filtered.filter(
        (anime) => anime.type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter((anime) =>
        anime.genres.some((genre) => selectedGenres.includes(genre.mal_id))
      );
    }

    // Min score filter
    if (minScore && minScore !== "none") {
      const minScoreValue = parseFloat(minScore);
      filtered = filtered.filter(
        (anime) => anime.score && anime.score >= minScoreValue
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (orderBy) {
        case "addedAt":
          comparison = (a.addedAt || 0) - (b.addedAt || 0);
          break;
        case "score":
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "episodes":
          comparison = (a.episodes || 0) - (b.episodes || 0);
          break;
        case "type":
          comparison = (a.type || "").localeCompare(b.type || "");
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [
    favoriteAnimeList,
    searchQuery,
    selectedType,
    selectedGenres,
    minScore,
    orderBy,
    sortOrder,
  ]);

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
    setSelectedGenres([]);
    setMinScore("");
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedType || selectedGenres.length > 0 || minScore
  );

  // Get available genres from favorites
  const availableGenres = useMemo(() => {
    const genreIds = new Set<number>();
    favoriteAnimeList.forEach((anime) => {
      anime.genres.forEach((genre) => genreIds.add(genre.mal_id));
    });
    return initialGenres.filter((genre) => genreIds.has(genre.mal_id));
  }, [favoriteAnimeList, initialGenres]);

  // Get available types from favorites
  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    favoriteAnimeList.forEach((anime) => {
      if (anime.type) types.add(anime.type.toLowerCase());
    });
    return [
      { value: "none", label: "All Types" },
      ...Array.from(types).map((type) => ({
        value: type,
        label: type.toUpperCase(),
      })),
    ];
  }, [favoriteAnimeList]);

  const favoritesSortOptions = [
    { value: "addedAt", label: "Date Added" },
    { value: "score", label: "Score" },
    { value: "title", label: "Title" },
    { value: "episodes", label: "Episodes" },
    { value: "type", label: "Type" },
  ];

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AnimeEmptyState
          title="No Favorites Yet"
          description="Start adding anime to your favorites by clicking the heart icon on any anime card."
        />
        <Link href="/">
          <Button className="mt-6">Browse Anime</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            My Favorites
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredAnimeList.length}{" "}
            {favorites.length === 1 ? "anime" : "anime"}
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={() => {
            if (confirm("Are you sure you want to clear all favorites?")) {
              clearFavorites();
            }
          }}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      {/* Mobile Search and Controls */}
      <Card className="lg:hidden sticky top-22 bg-gray-100 dark:bg-gray-800 py-4 px-0 z-10">
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search favorites..."
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
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none w-1/2"
              >
                <Grid3x3 className="w-4 h-4 mr-2" />
                <span>Grid</span>
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
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
                <SheetHeader>
                  <SheetTitle>Filters & Search</SheetTitle>
                  <SheetDescription>
                    Search and filter your favorite anime
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <AnimeSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search favorites..."
                    selectedType={selectedType}
                    onTypeChange={setSelectedType}
                    availableTypes={availableTypes}
                    showTypeFilter={true}
                    showStatusFilter={false}
                    showRatingFilter={false}
                    minScore={minScore}
                    onMinScoreChange={setMinScore}
                    showMinScoreFilter={true}
                    orderBy={orderBy}
                    onOrderByChange={setOrderBy}
                    sortOrder={sortOrder}
                    onSortOrderChange={setSortOrder}
                    sortOptions={favoritesSortOptions}
                    selectedGenres={selectedGenres}
                    onGenreToggle={handleGenreToggle}
                    availableGenres={availableGenres}
                    showGenreFilter={availableGenres.length > 0}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    showInfiniteScrollToggle={false}
                    showSfwToggle={false}
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

      <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
        {/* Desktop Search and Filters */}
        <div className="hidden md:block col-span-2">
          <AnimeSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search favorites..."
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            availableTypes={availableTypes}
            showTypeFilter={true}
            showStatusFilter={false}
            showRatingFilter={false}
            minScore={minScore}
            onMinScoreChange={setMinScore}
            showMinScoreFilter={true}
            orderBy={orderBy}
            onOrderByChange={setOrderBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            sortOptions={favoritesSortOptions}
            selectedGenres={selectedGenres}
            onGenreToggle={handleGenreToggle}
            availableGenres={availableGenres}
            showGenreFilter={availableGenres.length > 0}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showInfiniteScrollToggle={false}
            showSfwToggle={false}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
        <div className="col-span-1 md:col-span-8">
          {/* Results */}
          {filteredAnimeList.length === 0 && favorites.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No favorites match your filters
              </p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {filteredAnimeList.length > 0 && (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredAnimeList.map((anime) => (
                    <AnimeCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAnimeList.map((anime) => (
                    <AnimeListCard key={anime.mal_id} anime={anime} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

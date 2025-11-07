"use client";

import { useState, useMemo } from "react";
import { AnimeCard } from "@/components/AnimeCard";
import { AnimeListCard } from "@/components/AnimeListCard";
import { useFavoritesStore } from "@/lib/store";
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
  Grid3x3,
  List,
  Search,
  SlidersHorizontal,
  X,
  Trash2,
  Heart,
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
import { Anime } from "@/lib/types/anime";
import AnimeEmptyState from "@/components/AnimeEmptyState";
import Link from "next/link";

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

  const hasActiveFilters =
    searchQuery || selectedType || selectedGenres.length > 0 || minScore;

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
    return Array.from(types);
  }, [favoriteAnimeList]);

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
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            My Favorites
          </h1>
          <p className="text-muted-foreground mt-2">
            {filteredAnimeList.length} of {favorites.length}{" "}
            {favorites.length === 1 ? "anime" : "anime"}
          </p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm("Are you sure you want to clear all favorites?")) {
              clearFavorites();
            }
          }}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 space-y-4 sticky top-28 bg-gray-100/85 dark:bg-gray-800/85 sm:rounded-2xl items-center text-center z-50 backdrop-blur-md p-4">
        <CardContent>
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
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

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3">
            {/* Type Filter */}
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Types</SelectItem>
                {availableTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.toUpperCase()}
                  </SelectItem>
                ))}
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
                <SelectItem value="addedAt">Date Added</SelectItem>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="episodes">Episodes</SelectItem>
                <SelectItem value="type">Type</SelectItem>
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
            {availableGenres.length > 0 && (
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
                  {availableGenres.map((genre) => (
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
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

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
        </CardContent>
      </Card>

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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
    </>
  );
}

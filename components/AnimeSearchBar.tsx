"use client";

import { useState } from "react";
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
  Infinity,
  ShieldCheck,
  ShieldOff,
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
import { Separator } from "@radix-ui/react-dropdown-menu";

interface AnimeSearchBarProps {
  // Search and filters
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Type filter
  selectedType: string;
  onTypeChange: (value: string) => void;
  availableTypes?: Array<{ value: string; label: string }>;
  showTypeFilter?: boolean;

  // Status filter (only for browse)
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
  showStatusFilter?: boolean;

  // Rating filter (only for browse)
  selectedRating?: string;
  onRatingChange?: (value: string) => void;
  showRatingFilter?: boolean;

  // Min score filter
  minScore: string;
  onMinScoreChange: (value: string) => void;
  showMinScoreFilter?: boolean;

  // Sort options
  orderBy: string;
  onOrderByChange: (value: string) => void;
  sortOrder: string;
  onSortOrderChange: (value: string) => void;
  sortOptions: Array<{ value: string; label: string }>;

  // Genre filter
  selectedGenres: number[];
  onGenreToggle: (genreId: number) => void;
  availableGenres: Array<{ mal_id: number; name: string }>;
  showGenreFilter?: boolean;

  // View mode
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;

  // Browse-specific features
  infiniteScrollEnabled?: boolean;
  onInfiniteScrollToggle?: () => void;
  showInfiniteScrollToggle?: boolean;

  sfwMode?: boolean;
  onSfwToggle?: () => void;
  showSfwToggle?: boolean;

  // Clear filters
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function AnimeSearchBar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search anime...",
  selectedType,
  onTypeChange,
  availableTypes = [
    { value: "none", label: "All Types" },
    { value: "tv", label: "TV" },
    { value: "movie", label: "Movie" },
    { value: "ova", label: "OVA" },
    { value: "special", label: "Special" },
    { value: "ona", label: "ONA" },
    { value: "music", label: "Music" },
  ],
  showTypeFilter = true,
  selectedStatus = "",
  onStatusChange = () => {},
  showStatusFilter = false,
  selectedRating = "",
  onRatingChange = () => {},
  showRatingFilter = false,
  minScore,
  onMinScoreChange,
  showMinScoreFilter = true,
  orderBy,
  onOrderByChange,
  sortOrder,
  onSortOrderChange,
  sortOptions,
  selectedGenres,
  onGenreToggle,
  availableGenres,
  showGenreFilter = true,
  viewMode,
  onViewModeChange,
  infiniteScrollEnabled = false,
  onInfiniteScrollToggle = () => {},
  showInfiniteScrollToggle = false,
  sfwMode = true,
  onSfwToggle = () => {},
  showSfwToggle = false,
  onClearFilters,
  hasActiveFilters,
}: AnimeSearchBarProps) {
  const [genreSearchQuery, setGenreSearchQuery] = useState("");

  const filteredGenres = availableGenres.filter((genre) =>
    genre.name.toLowerCase().includes(genreSearchQuery.toLowerCase())
  );

  return (
    <Card className="space-y-4 sticky top-25 bg-gray-100/85 dark:bg-gray-800/85 sm:rounded-2xl items-center text-center z-50 backdrop-blur-md">
      <CardContent className="flex flex-col gap-3 w-full">
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row gap-3 col-span-5">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onSearchChange(e.target.value)
              }
              className="pl-9"
            />
          </div>
        </div>

        <hr />

        {/* View Toggle */}
        <div className="inline-flex rounded-full shadow-sm w-full" role="group">
          <Button
            type="button"
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none w-1/2"
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            type="button"
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none w-1/2"
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>
        {/* Infinite Scroll Toggle (Browse only) */}
        {showInfiniteScrollToggle && (
          <Button
            type="button"
            variant={infiniteScrollEnabled ? "default" : "outline"}
            size="sm"
            onClick={onInfiniteScrollToggle}
            title={
              infiniteScrollEnabled
                ? "Disable infinite scroll"
                : "Enable infinite scroll"
            }
          >
            <Infinity className="w-4 h-4 mr-2" />
            Auto Load
          </Button>
        )}
        {/* SFW Toggle (Browse only) */}
        {showSfwToggle && (
          <Button
            type="button"
            variant={sfwMode ? "default" : "outline"}
            size="sm"
            onClick={onSfwToggle}
            title={
              sfwMode
                ? "Safe for work mode (hentai filtered)"
                : "Show all content (including hentai)"
            }
          >
            {sfwMode ? (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                <p>Safe Mode</p>
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4 mr-2" />
                <p>All Content</p>
              </>
            )}
          </Button>
        )}

        <hr />

        {/* Type Filter */}
        {showTypeFilter && (
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {/* Status Filter (Browse only) */}
        {showStatusFilter && (
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Status</SelectItem>
              <SelectItem value="airing">Airing</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
        )}
        {/* Rating Filter (Browse only) */}
        {showRatingFilter && (
          <Select value={selectedRating} onValueChange={onRatingChange}>
            <SelectTrigger className="w-full">
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
        )}
        {/* Min Score Filter */}
        {showMinScoreFilter && (
          <Select value={minScore} onValueChange={onMinScoreChange}>
            <SelectTrigger className="w-full">
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
        )}
        {/* Sort By */}
        <Select value={orderBy} onValueChange={onOrderByChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Sort Order */}
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
        {/* Genre Filter Dropdown */}
        {showGenreFilter && availableGenres.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Genres
                {selectedGenres.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {selectedGenres.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 max-h-[400px]">
              <DropdownMenuLabel>Select Genres</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="px-2 pb-2">
                <Input
                  placeholder="Search genres..."
                  value={genreSearchQuery}
                  onChange={(e) => setGenreSearchQuery(e.target.value)}
                  className="h-8"
                />
              </div>
              <DropdownMenuSeparator />
              <div className="overflow-y-auto max-h-[280px]">
                {filteredGenres.map((genre) => (
                  <DropdownMenuCheckboxItem
                    key={genre.mal_id}
                    checked={selectedGenres.includes(genre.mal_id)}
                    onCheckedChange={() => onGenreToggle(genre.mal_id)}
                  >
                    {genre.name}
                  </DropdownMenuCheckboxItem>
                ))}
                {filteredGenres.length === 0 && (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No genres found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Active Filters Display */}
        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genreId) => {
              const genre = availableGenres.find((g) => g.mal_id === genreId);
              return (
                <Badge key={genreId} variant="secondary">
                  {genre?.name}
                  <Button
                    onClick={() => onGenreToggle(genreId)}
                    variant={"outline"}
                    size={"icon-sm"}
                    className="p-0"
                  >
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => onGenreToggle(genreId)}
                    />
                  </Button>
                </Badge>
              );
            })}
          </div>
        )}

        {hasActiveFilters && <hr />}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button onClick={onClearFilters}>
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

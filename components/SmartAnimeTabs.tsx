"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeInfoTab } from "@/components/AnimeInfoTab";
import { LazyAnimeMediaTab } from "@/components/LazyAnimeMediaTab";
import { LazyAnimeStatisticsTab } from "@/components/LazyAnimeStatisticsTab";
import { LazyAnimeRelatedTab } from "@/components/LazyAnimeRelatedTab";
import { Anime } from "@/lib/types/anime";
import {
  fetchAnimeCharacters,
  fetchAnimePictures,
  fetchAnimeVideos,
  fetchAnimeStatistics,
  fetchAnimeRelations,
} from "@/lib/api/jikan";
import { animeKeys } from "@/lib/hooks/useAnime";

interface SmartAnimeTabsProps {
  anime: Anime;
  animeId: number;
}

export function SmartAnimeTabs({ anime, animeId }: SmartAnimeTabsProps) {
  const [activeTab, setActiveTab] = useState("info");
  const [loadedTabs, setLoadedTabs] = useState(new Set(["info"]));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Mark this tab as loaded so data fetching is enabled
    setLoadedTabs((prev) => new Set([...prev, tab]));
  };

  // Characters query - always enabled since info tab loads by default
  const {
    data: characters = [],
    isLoading: charactersLoading,
    error: charactersError,
  } = useQuery({
    queryKey: animeKeys.characters(animeId),
    queryFn: () => fetchAnimeCharacters(animeId),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!animeId && animeId > 0,
  });

  // Pictures query - only enabled when media tab is activated
  const {
    data: pictures = [],
    isLoading: picturesLoading,
    error: picturesError,
  } = useQuery({
    queryKey: animeKeys.pictures(animeId),
    queryFn: () => fetchAnimePictures(animeId),
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!animeId && animeId > 0 && loadedTabs.has("media"),
  });

  // Videos query - only enabled when media tab is activated
  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = useQuery({
    queryKey: animeKeys.videos(animeId),
    queryFn: () => fetchAnimeVideos(animeId),
    staleTime: 2 * 60 * 60 * 1000, // 2 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!animeId && animeId > 0 && loadedTabs.has("media"),
  });

  // Statistics query - only enabled when statistics tab is activated
  const {
    data: statistics,
    isLoading: statisticsLoading,
    error: statisticsError,
  } = useQuery({
    queryKey: animeKeys.statistics(animeId),
    queryFn: () => fetchAnimeStatistics(animeId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: !!animeId && animeId > 0 && loadedTabs.has("statistics"),
  });

  // Relations query - only enabled when related tab is activated
  const {
    data: relations = [],
    isLoading: relationsLoading,
    error: relationsError,
  } = useQuery({
    queryKey: animeKeys.relations(animeId),
    queryFn: () => fetchAnimeRelations(animeId),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!animeId && animeId > 0 && loadedTabs.has("related"),
  });

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
        <TabsTrigger value="related">Related</TabsTrigger>
      </TabsList>

      {/* Info Tab */}
      <TabsContent value="info">
        <AnimeInfoTab
          anime={anime}
          characters={characters}
          isLoading={charactersLoading}
          error={charactersError}
        />
      </TabsContent>

      {/* Media Tab */}
      <TabsContent value="media">
        <LazyAnimeMediaTab
          pictures={pictures}
          videos={videos}
          animeTitle={anime.title}
          picturesLoading={picturesLoading && loadedTabs.has("media")}
          videosLoading={videosLoading && loadedTabs.has("media")}
          picturesError={picturesError}
          videosError={videosError}
        />
      </TabsContent>

      {/* Statistics Tab */}
      <TabsContent value="statistics">
        <LazyAnimeStatisticsTab
          statistics={statistics}
          isLoading={statisticsLoading && loadedTabs.has("statistics")}
          error={statisticsError}
        />
      </TabsContent>

      {/* Related Tab */}
      <TabsContent value="related">
        <LazyAnimeRelatedTab
          relations={relations}
          isLoading={relationsLoading && loadedTabs.has("related")}
          error={relationsError}
        />
      </TabsContent>
    </Tabs>
  );
}

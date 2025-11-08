import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeImageGallery } from "@/components/AnimeImageGallery";
import { VideoListCard } from "@/components/VideoListCard";
import { AnimePicture, AnimeVideos } from "@/lib/types/anime";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyAnimeMediaTabProps {
  pictures: AnimePicture[];
  videos: AnimeVideos | null;
  animeTitle: string;
  picturesLoading: boolean;
  videosLoading: boolean;
  picturesError?: Error | null;
  videosError?: Error | null;
}

export function LazyAnimeMediaTab({
  pictures,
  videos,
  animeTitle,
  picturesLoading,
  videosLoading,
  picturesError,
  videosError,
}: LazyAnimeMediaTabProps) {
  const isLoading = picturesLoading || videosLoading;
  const hasError = picturesError || videosError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Pictures Loading Skeleton */}
        <div className="flex flex-col gap-6">
          <Skeleton className="h-6 w-20" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="aspect-[3/4] rounded-lg" />
            ))}
          </div>
        </div>

        <hr />

        {/* Videos Loading Skeleton */}
        <div className="flex flex-col gap-6">
          <Skeleton className="h-6 w-20" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="w-32 aspect-video rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Failed to load media data.</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pictures Section - Additional promotional images and screenshots */}
      {pictures && pictures.length > 0 && (
        <>
          <div className="flex flex-col gap-6">
            <h3>Pictures</h3>
            <AnimeImageGallery pictures={pictures} animeTitle={animeTitle} />
          </div>
          <hr />
        </>
      )}

      {/* Videos Section - Promotional videos, music videos, episodes */}
      {videos &&
        (videos.promo.length > 0 ||
          videos.music_videos.length > 0 ||
          videos.episodes.length > 0) && (
          <>
            <div className="flex flex-col gap-6">
              <h3 className="flex items-center gap-2">Videos</h3>
              <Tabs
                defaultValue={
                  videos.promo.length > 0
                    ? "promo"
                    : videos.music_videos.length > 0
                    ? "music"
                    : "episodes"
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {videos.promo.length > 0 && (
                    <TabsTrigger value="promo">
                      Promotional <Badge>{videos.promo.length}</Badge>
                    </TabsTrigger>
                  )}
                  {videos.music_videos.length > 0 && (
                    <TabsTrigger value="music">
                      Music Videos <Badge>{videos.music_videos.length}</Badge>
                    </TabsTrigger>
                  )}
                  {videos.episodes.length > 0 && (
                    <TabsTrigger value="episodes">
                      Episodes <Badge>{videos.episodes.length}</Badge>
                    </TabsTrigger>
                  )}
                </TabsList>

                {videos.promo.length > 0 && (
                  <TabsContent value="promo">
                    <div>
                      {videos.promo.map((video, index) => (
                        <VideoListCard
                          key={index}
                          video={video}
                          videoType="Promotional Video"
                        />
                      ))}
                    </div>
                  </TabsContent>
                )}

                {videos.music_videos.length > 0 && (
                  <TabsContent value="music">
                    <div>
                      {videos.music_videos.map((video, index) => (
                        <VideoListCard
                          key={index}
                          video={video}
                          videoType="Music Video"
                        />
                      ))}
                    </div>
                  </TabsContent>
                )}

                {videos.episodes.length > 0 && (
                  <TabsContent value="episodes">
                    <div>
                      {videos.episodes.map((video, index) => (
                        <VideoListCard
                          key={index}
                          video={video}
                          videoType="Episode Video"
                        />
                      ))}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </>
        )}

      {/* No media available */}
      {(!pictures || pictures.length === 0) &&
        (!videos ||
          (videos.promo.length === 0 &&
            videos.music_videos.length === 0 &&
            videos.episodes.length === 0)) && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No media content available.</p>
          </div>
        )}
    </div>
  );
}

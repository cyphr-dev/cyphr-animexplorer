import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeImageGallery } from "@/components/AnimeImageGallery";
import { VideoListCard } from "@/components/VideoListCard";
import { AnimePicture, AnimeVideos } from "@/lib/types/anime";
import { Badge } from "@/components/ui/badge";

interface AnimeMediaTabProps {
  pictures: AnimePicture[];
  videos: AnimeVideos | null;
  animeTitle: string;
}

export function AnimeMediaTab({
  pictures,
  videos,
  animeTitle,
}: AnimeMediaTabProps) {
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
    </div>
  );
}

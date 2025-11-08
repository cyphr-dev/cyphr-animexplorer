import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeImageGallery } from "@/components/AnimeImageGallery";
import { AnimePicture, AnimeVideo, AnimeVideos } from "@/lib/types/anime";

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
  // Helper function to get video image with fallback
  const getVideoImageSrc = (video: AnimeVideo): string => {
    return (
      video.images?.large_image_url ||
      video.images?.image_url ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjYzRjNGM0Ij5WaWRlbzwvdGV4dD48L3N2Zz4="
    );
  };

  return (
    <div className="space-y-6">
      {/* Pictures Section - Additional promotional images and screenshots */}
      <AnimeImageGallery pictures={pictures} animeTitle={animeTitle} />

      {/* Videos Section - Promotional videos, music videos, episodes */}
      {videos &&
        (videos.promo.length > 0 ||
          videos.music_videos.length > 0 ||
          videos.episodes.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <h3>Videos</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="promo" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {videos.promo.length > 0 && (
                    <TabsTrigger value="promo">
                      Promotional ({videos.promo.length})
                    </TabsTrigger>
                  )}
                  {videos.music_videos.length > 0 && (
                    <TabsTrigger value="music">
                      Music Videos ({videos.music_videos.length})
                    </TabsTrigger>
                  )}
                  {videos.episodes.length > 0 && (
                    <TabsTrigger value="episodes">
                      Episodes ({videos.episodes.length})
                    </TabsTrigger>
                  )}
                </TabsList>

                {videos.promo.length > 0 && (
                  <TabsContent value="promo" className="mt-6">
                    <div className="space-y-3">
                      {videos.promo.map((video, index) =>
                        video.url ? (
                          <Link
                            key={index}
                            href={video.url}
                            target="_blank"
                            className="group block"
                          >
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={getVideoImageSrc(video)}
                                  alt={video.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="96px"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium hover:text-primary transition-colors line-clamp-2">
                                  {video.title}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Promotional Video
                                </p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/20"
                          >
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                              <Image
                                src={getVideoImageSrc(video)}
                                alt={video.title}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                              <div className="absolute inset-0 bg-black/20" />
                              <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white opacity-50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium line-clamp-2 text-muted-foreground">
                                {video.title}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Promotional Video (No URL)
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                )}

                {videos.music_videos.length > 0 && (
                  <TabsContent value="music" className="mt-6">
                    <div className="space-y-3">
                      {videos.music_videos.map((video, index) =>
                        video.url ? (
                          <Link
                            key={index}
                            href={video.url}
                            target="_blank"
                            className="group block"
                          >
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={getVideoImageSrc(video)}
                                  alt={video.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="96px"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium hover:text-primary transition-colors line-clamp-2">
                                  {video.title}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Music Video
                                </p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/20"
                          >
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                              <Image
                                src={getVideoImageSrc(video)}
                                alt={video.title}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                              <div className="absolute inset-0 bg-black/20" />
                              <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white opacity-50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium line-clamp-2 text-muted-foreground">
                                {video.title}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Music Video (No URL)
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                )}

                {videos.episodes.length > 0 && (
                  <TabsContent value="episodes" className="mt-6">
                    <div className="space-y-3">
                      {videos.episodes.map((video, index) =>
                        video.url ? (
                          <Link
                            key={index}
                            href={video.url}
                            target="_blank"
                            className="group block"
                          >
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={getVideoImageSrc(video)}
                                  alt={video.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                  sizes="96px"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium hover:text-primary transition-colors line-clamp-2">
                                  {video.title}
                                </h5>
                                <p className="text-sm text-muted-foreground">
                                  Episode Video
                                </p>
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/20"
                          >
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                              <Image
                                src={getVideoImageSrc(video)}
                                alt={video.title}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                              <div className="absolute inset-0 bg-black/20" />
                              <PlayCircle className="absolute inset-0 m-auto w-6 h-6 text-white opacity-50" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium line-clamp-2 text-muted-foreground">
                                {video.title}
                              </h5>
                              <p className="text-sm text-muted-foreground">
                                Episode Video (No URL)
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}
    </div>
  );
}

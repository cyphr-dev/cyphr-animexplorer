import Image from "next/image";
import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { AnimeVideo } from "@/lib/types/anime";

interface VideoListCardProps {
  video: AnimeVideo;
  videoType: string;
}

// Helper function to get video image with fallback
const getVideoImageSrc = (video: AnimeVideo): string => {
  return (
    video.images?.large_image_url ||
    video.images?.image_url ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjYzRjNGM0Ij5WaWRlbzwvdGV4dD48L3N2Zz4="
  );
};

export function VideoListCard({ video, videoType }: VideoListCardProps) {
  // If video has URL, render as clickable link
  if (video.url) {
    return (
      <Link href={video.url} target="_blank" className="group block">
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
            <p className="text-sm text-muted-foreground">{videoType}</p>
          </div>
        </div>
      </Link>
    );
  }

  // If no URL, render as non-clickable item
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
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
        <p className="text-sm text-muted-foreground">{videoType} (No URL)</p>
      </div>
    </div>
  );
}

import {
  Star,
  Calendar,
  Film,
  Clock,
  TrendingUp,
  Heart,
  Users,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ClickablePoster } from "@/components/ClickablePoster";
import { Badge } from "@/components/ui/badge";
import { Anime } from "@/lib/types/anime";

interface AnimeDetailsHeaderProps {
  anime: Anime;
}

export function AnimeDetailsSidebar({ anime }: AnimeDetailsHeaderProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {/* Title Section */}
        <div className="flex flex-col gap-2 bg-background pb-2">
          <h3>{anime.title}</h3>
          {anime.title_japanese && (
            <p className="text-muted-foreground">{anime.title_japanese}</p>
          )}
          {anime.title_english && anime.title_english !== anime.title && (
            <p className="text-muted-foreground mb-2">{anime.title_english}</p>
          )}
        </div>
        <div className="flex flex-col gap-6">
          {/* Clickable Poster */}
          <ClickablePoster anime={anime} />

          {/* Favorite Button */}
          <FavoriteButton anime={anime} />

          {/* Genres Section */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {anime.genres.map((genre) => (
                <Badge key={genre.mal_id} className="" variant={"outline"}>
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
          {/* Quick Info */}
          <div className="flex flex-col gap-4">
            {anime.type && (
              <div className="flex items-start gap-3">
                <Film className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{anime.type}</p>
                </div>
              </div>
            )}

            {anime.episodes && (
              <div className="flex items-start gap-3">
                <PlayCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Episodes</p>
                  <p className="font-medium">
                    {anime.episodes}{" "}
                    {anime.episodes === 1 ? "Episode" : "Episodes"}
                  </p>
                </div>
              </div>
            )}

            {anime.status && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{anime.status}</p>
                </div>
              </div>
            )}

            {anime.duration && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{anime.duration}</p>
                </div>
              </div>
            )}

            {anime.aired?.string && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Airing Date</p>
                  <p className="font-medium">{anime.aired.string}</p>
                </div>
              </div>
            )}

            {anime.rating && (
              <div className="flex items-start gap-3 sm:col-span-2">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="font-medium">{anime.rating}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

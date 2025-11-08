import { Anime } from "@/lib/types/anime";
import { Card, CardContent } from "./ui/card";
import { Heart, Star, TrendingUp, Users } from "lucide-react";

export default function AnimeStatsGrid({ anime }: { anime: Anime }) {
  return (
    <Card>
      <CardContent className="w-full grid grid-cols-1 gap-8">
        {/* Score */}
        <div className="flex flex-col col-span-1 items-center justify-center text-center">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 mb-2" />
          <h4>{anime.score ? anime.score.toFixed(1) : "N/A"}</h4>
          <p>Score</p>
        </div>
        {/* Rank */}
        {anime.rank && (
          <div className="flex flex-col col-span-1 items-center justify-center text-center">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <h4>#{anime.rank}</h4>
            <p className="text-muted-foreground">Ranked</p>
          </div>
        )}
        {/* Popularity */}
        <div className="flex flex-col col-span-1 items-center justify-center text-center">
          <Users className="w-6 h-6 text-primary mb-2" />
          <h4>#{anime.popularity}</h4>
          <p className="text-muted-foreground">Popularity</p>
        </div>
        {/* Favorites */}
        <div className="flex flex-col col-span-1 items-center justify-center text-center">
          <Heart className="w-6 h-6 text-red-500 mb-2" />
          <h4>{anime.favorites.toLocaleString()}</h4>
          <p className="text-muted-foreground">Favorites</p>
        </div>
      </CardContent>
    </Card>
  );
}

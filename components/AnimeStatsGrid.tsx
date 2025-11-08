import { Anime } from "@/lib/types/anime";
import { Card, CardContent } from "./ui/card";
import { Heart, Star, TrendingUp, Users } from "lucide-react";

export default function AnimeStatsGrid({ anime }: { anime: Anime }) {
  return (
    <div className="w-full grid grid-cols-1 gap-4">
      {/* Score */}
      <Card className="col-span-1">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 mb-2" />
          <h4>{anime.score ? anime.score.toFixed(1) : "N/A"}</h4>
          <p>Score</p>
        </CardContent>
      </Card>

      {/* Rank */}
      {anime.rank && (
        <Card className="col-span-1">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <TrendingUp className="w-6 h-6 text-primary mb-2" />
            <h4>#{anime.rank}</h4>
            <p className="text-muted-foreground">Ranked</p>
          </CardContent>
        </Card>
      )}

      {/* Popularity */}
      <Card className="col-span-1">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Users className="w-6 h-6 text-primary mb-2" />
          <h4>#{anime.popularity}</h4>
          <p className="text-muted-foreground">Popularity</p>
        </CardContent>
      </Card>

      {/* Favorites */}
      <Card className="col-span-1">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Heart className="w-6 h-6 text-red-500 mb-2" />
          <h4>{anime.favorites.toLocaleString()}</h4>
          <p className="text-muted-foreground">Favorites</p>
        </CardContent>
      </Card>
    </div>
  );
}

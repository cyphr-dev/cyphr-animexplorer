import { BarChart3 } from "lucide-react";
import { AnimeStatistics } from "@/lib/types/anime";

interface AnimeStatisticsTabProps {
  statistics: AnimeStatistics | null;
}

export function AnimeStatisticsTab({ statistics }: AnimeStatisticsTabProps) {
  if (!statistics) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Statistics Available</h3>
        <p className="text-muted-foreground text-center">
          Statistics data is not available for this anime.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Section */}
      <div className="flex flex-col gap-6">
        <h3 className="flex items-center gap-2">Statistics</h3>
        <div className="space-y-6">
          {/* Watching Status Stats */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Viewing Status</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <h4 className="text-green-500">
                  {statistics.watching.toLocaleString()}
                </h4>
                <p className="text-muted-foreground">Watching</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <h4 className="text-blue-500">
                  {statistics.completed.toLocaleString()}
                </h4>
                <p className="text-muted-foreground">Completed</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <h4 className="text-yellow-500">
                  {statistics.on_hold.toLocaleString()}
                </h4>
                <p className="text-muted-foreground">On Hold</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <h4 className="text-red-500">
                  {statistics.dropped.toLocaleString()}
                </h4>
                <p className="text-muted-foreground">Dropped</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <h4 className="text-purple-500">
                  {statistics.plan_to_watch.toLocaleString()}
                </h4>
                <p className="text-muted-foreground">Plan to Watch</p>
              </div>
            </div>
          </div>

          {/* Score Distribution */}
          {statistics.scores && statistics.scores.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Score Distribution</h4>
              <div className="space-y-2">
                {statistics.scores
                  .filter((score) => score.votes > 0)
                  .sort((a, b) => b.score - a.score)
                  .map((score) => (
                    <div key={score.score} className="flex items-center gap-3">
                      <div className="w-8 text-sm font-medium text-right">
                        {score.score}
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${Math.max(score.percentage, 2)}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {score.percentage.toFixed(1)}%
                        </div>
                      </div>
                      <p className="w-24 text-xs text-muted-foreground text-right">
                        {score.votes.toLocaleString()} votes
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

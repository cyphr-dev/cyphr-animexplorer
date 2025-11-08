import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimeStatistics } from "@/lib/types/anime";

interface AnimeStatisticsTabProps {
  statistics: AnimeStatistics | null;
}

export function AnimeStatisticsTab({ statistics }: AnimeStatisticsTabProps) {
  if (!statistics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Statistics Available
          </h3>
          <p className="text-muted-foreground text-center">
            Statistics data is not available for this anime.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          <h3>Statistics</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Watching Status Stats */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Viewing Status</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {statistics.watching.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Watching</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {statistics.completed.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-yellow-500">
                  {statistics.on_hold.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">On Hold</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-red-500">
                  {statistics.dropped.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Dropped</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-purple-500">
                  {statistics.plan_to_watch.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Plan to Watch
                </div>
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
                          className="h-full bg-linear-to-r from-red-500 via-yellow-500 to-green-500 transition-all"
                          style={{
                            width: `${Math.max(score.percentage, 2)}%`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                          {score.percentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="w-20 text-sm text-muted-foreground text-right">
                        {score.votes.toLocaleString()} votes
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

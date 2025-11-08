import { AnimeStatistics } from "@/lib/types/anime";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Star,
  TrendingUp,
  Eye,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";

interface LazyAnimeStatisticsTabProps {
  statistics: AnimeStatistics | null;
  isLoading: boolean;
  error?: Error | null;
}

export function LazyAnimeStatisticsTab({
  statistics,
  isLoading,
  error,
}: LazyAnimeStatisticsTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Failed to load statistics data.</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  const totalScoreVotes = statistics.scores.reduce(
    (sum, score) => sum + score.votes,
    0
  );
  const averageScore =
    statistics.scores.reduce(
      (sum, score) => sum + score.score * score.votes,
      0
    ) / totalScoreVotes;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Watching</span>
            </div>
            <div className="text-2xl font-bold text-blue-500">
              {statistics.watching?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {statistics.completed?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">On Hold</span>
            </div>
            <div className="text-2xl font-bold text-yellow-500">
              {statistics.on_hold?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserX className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Dropped</span>
            </div>
            <div className="text-2xl font-bold text-red-500">
              {statistics.dropped?.toLocaleString() || "0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Score Distribution
          </CardTitle>
          <CardDescription>
            Average Score: {averageScore ? averageScore.toFixed(2) : "N/A"} / 10
            <span className="ml-4">
              Total Votes: {totalScoreVotes.toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.scores
              .sort((a, b) => b.score - a.score)
              .map((score) => {
                const percentage =
                  totalScoreVotes > 0
                    ? (score.votes / totalScoreVotes) * 100
                    : 0;
                return (
                  <div key={score.score} className="flex items-center gap-4">
                    <div className="w-8 text-sm font-medium">{score.score}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-sm text-muted-foreground text-right">
                      {score.votes.toLocaleString()}
                    </div>
                    <div className="w-12 text-xs text-muted-foreground text-right">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Plan to Watch
              </span>
              <Badge variant="outline">
                {statistics.plan_to_watch?.toLocaleString() || "0"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Members
              </span>
              <Badge variant="outline">
                {(
                  (statistics.watching || 0) +
                  (statistics.completed || 0) +
                  (statistics.on_hold || 0) +
                  (statistics.dropped || 0) +
                  (statistics.plan_to_watch || 0)
                ).toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Completion Rate
              </span>
              <Badge variant="outline">
                {statistics.watching && statistics.completed
                  ? `${(
                      (statistics.completed /
                        (statistics.watching + statistics.completed)) *
                      100
                    ).toFixed(1)}%`
                  : "N/A"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Drop Rate</span>
              <Badge variant="outline">
                {statistics.dropped && totalScoreVotes
                  ? `${((statistics.dropped / totalScoreVotes) * 100).toFixed(
                      1
                    )}%`
                  : "N/A"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

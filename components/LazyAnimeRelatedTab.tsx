import { AnimeRelation } from "@/lib/types/anime";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyAnimeRelatedTabProps {
  relations: AnimeRelation[] | null;
  isLoading: boolean;
  error?: Error | null;
}

export function LazyAnimeRelatedTab({
  relations,
  isLoading,
  error,
}: LazyAnimeRelatedTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex gap-3 p-3 border rounded-lg">
                    <Skeleton className="w-16 h-20 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Failed to load related anime data.</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!relations || relations.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No related anime found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {relations.map((relation, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {relation.relation}
              <Badge variant="outline">{relation.entry.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relation.entry.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="text-center">
                    <div className="w-16 h-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium line-clamp-2 mb-1">
                      {entry.name}
                    </h5>
                    <p className="text-sm text-muted-foreground capitalize mb-1">
                      {entry.type}
                    </p>
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View Details →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { AnimeRelation } from "@/lib/types/anime";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "./ui/badge";

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
        <div className="flex flex-col gap-6">
          <h3>Related Anime</h3>

          <div className="grid grid-cols-1 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-3">
                <Skeleton className="w-16 h-20 rounded shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Failed to load related anime data.</p>
        <p className="text-sm">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!relations || relations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No related anime found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {relations.map((relation, index) => (
        <div key={index}>
          <div className="flex flex-col gap-6">
            <h3 className="capitalize items-center flex gap-2">
              {relation.relation} <Badge>{relation.entry.length}</Badge>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {relation.entry.map((entry, entryIndex) => (
                <div
                  key={entryIndex}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Entry Image */}
                  <div className="relative w-16 h-20 rounded overflow-hidden bg-muted shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No Image
                    </div>
                  </div>

                  {/* Entry Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                      {entry.name}
                    </h5>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm text-muted-foreground capitalize">
                        {entry.type}
                      </p>
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block"
                        >
                          View Details →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {index < relations.length - 1 && <hr />}
        </div>
      ))}
    </div>
  );
}

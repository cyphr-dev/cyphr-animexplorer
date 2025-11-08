import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailsLoading() {
  return (
    <div className="container mx-auto bg-background">
      <div className="mx-auto px-4 pt-4 md:pt-8 space-y-6 grid grid-cols-1 md:grid-cols-11 gap-8">
        {/* Sidebar Skeleton */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {/* Poster Skeleton */}
            <Card className="overflow-hidden">
              <Skeleton className="aspect-3/4 w-full" />
            </Card>

            {/* Action buttons */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Quick info */}
            <Card>
              <CardContent className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="md:col-span-7 flex flex-col gap-6">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-4">
            {/* Tab navigation */}
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 flex-1 rounded-md" />
              ))}
            </div>

            {/* Tab content */}
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Synopsis */}
                <div>
                  <Skeleton className="h-6 w-20 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>

                {/* Characters grid */}
                <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-12 h-16 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-3 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Sidebar Skeleton */}
        <div className="md:col-span-2">
          <div className="sticky top-26">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                      <Skeleton className="w-8 h-8 mx-auto mb-2" />
                      <Skeleton className="h-6 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

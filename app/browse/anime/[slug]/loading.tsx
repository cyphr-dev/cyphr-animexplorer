import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Poster Skeleton */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <Skeleton className="aspect-3/4 w-full" />
            </Card>
          </div>

          {/* Main Info Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Section */}
            <div>
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-7 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <Skeleton className="w-8 h-8 mb-2 rounded-full" />
                    <Skeleton className="h-8 w-12 mb-1" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-16 mb-1" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Synopsis Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* Genres Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <Skeleton className="h-8 w-24 mb-4" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-24 rounded-full" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

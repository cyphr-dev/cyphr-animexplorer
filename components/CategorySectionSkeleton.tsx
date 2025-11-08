import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function CategorySectionSkeleton() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Carousel-style layout */}
      <div className="w-full relative">
        <div className="flex gap-2 md:gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shrink-0 w-1/3 sm:w-1/5 md:w-1/5 lg:w-1/6">
              <Card className="h-full overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-3/4 w-full" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-20 mt-3 rounded-md" />
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-24" />
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
        {/* Carousel navigation buttons skeleton */}
        <div className="flex justify-end gap-2 mt-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </section>
  );
}

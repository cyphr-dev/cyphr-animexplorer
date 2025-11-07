import { CategorySectionSkeleton } from "@/components/CategorySectionSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background -mt-17">
      {/* Hero Section Skeleton */}
      <header className="flex flex-col h-[55dvh] align-middle justify-center bg-accent">
        <div className="p-4 container mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12 md:h-14 lg:h-16 w-64 md:w-80" />
            <Skeleton className="h-6 md:h-7 w-full max-w-2xl" />
            <Skeleton className="h-5 md:h-6 w-3/4 max-w-xl" />
          </div>

          <Skeleton className="h-12 w-48" />
        </div>
      </header>

      {/* Category Sections Skeleton */}
      <div className="container mx-auto px-4 py-8 flex flex-col gap-12">
        <div className="space-y-4">
          <CategorySectionSkeleton />
          <CategorySectionSkeleton />
          <CategorySectionSkeleton />
          <CategorySectionSkeleton />
        </div>
      </div>
    </div>
  );
}

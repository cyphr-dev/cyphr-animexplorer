import { CategorySectionSkeleton } from "@/components/CategorySectionSkeleton";
import AnimeHero from "@/components/AnimeHero";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background -mt-17">
      {/* Hero Section Skeleton */}
      <AnimeHero />

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

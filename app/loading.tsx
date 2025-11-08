import { CategorySectionSkeleton } from "@/components/CategorySectionSkeleton";
import AnimeHero from "@/components/AnimeHero";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background -mt-18">
      {/* Hero Section */}
      <AnimeHero />
      <div className="container mx-auto px-4 pt-4 md:pt-8 flex flex-col gap-12">
        {/* Category Sections */}
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

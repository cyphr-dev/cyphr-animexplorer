"use client";

import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Anime } from "@/lib/types/anime";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface AnimeCategorySectionProps {
  title: string;
  description?: string;
  animeList: Anime[];
  viewAllLink?: string;
}

export default function AnimeCategorySection({
  title,
  description,
  animeList,
  viewAllLink,
}: AnimeCategorySectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          )}
        </div>
        {viewAllLink && (
          <Link href={viewAllLink}>
            <Button variant="ghost" className="group">
              View All
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animeList.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </div>
    </section>
  );
}

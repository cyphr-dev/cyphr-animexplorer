"use client";

import { AnimeCard } from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Anime } from "@/lib/types/anime";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface AnimeCategorySectionProps {
  title: string;
  description?: string;
  animeList: Anime[];
  viewAllLink?: string;
  largerCards?: boolean;
}

export default function AnimeCategorySection({
  title,
  description,
  animeList,
  viewAllLink,
  largerCards = false,
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
            <Button className="group">
              <p>View All</p>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {animeList.map((anime, index) => (
            <CarouselItem
              key={index}
              className={`pl-2 md:pl-4 ${
                largerCards
                  ? "basis-1/3 sm:basis-1/4 md:basis-1/4 lg:basis-1/6"
                  : "basis-1/3 sm:basis-1/5 md:basis-1/5 lg:basis-1/7"
              }`}
            >
              <AnimeCard anime={anime} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function AnimeHero() {
  return (
    <header className="flex flex-col h-[400px] md:h-[500px] align-middle justify-center bg-[#621371] overflow-clip relative">
      <div className="p-4 container mx-auto flex flex-col gap-12 z-20 relative">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent ">
            AnimeXplorer
          </h1>
          <p className="text-white text-sm md:text-lg max-w-lg">
            Discover and explore the world of anime. Uses{" "}
            <a
              href="https://jikan.moe/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jikan API
            </a>{" "}
            to fetch anime data.
          </p>
        </div>

        <Link href="/browse" className="w-fit">
          <Button size="lg" className="px-8">
            <p className="text-white text-sm md:text-lg max-w-lg">
              Browse All Anime
            </p>
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
      <Image
        src={"/image/anime-mascot-hero.webp"}
        width={1000}
        height={500}
        className="object-cover absolute z-0 -right-50 -top-20 filter max-h-[900px]"
        alt="anime mascot lol"
      />
      {/* Gradient overlay for fade effect */}
      <div className="absolute inset-0 bg-linear-to-r from-[#621371] via-[#621371] to-transparent z-5" />
    </header>
  );
}

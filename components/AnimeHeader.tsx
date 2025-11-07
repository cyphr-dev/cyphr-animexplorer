"use client";

import Link from "next/link";
import { AnimeProfileAvatar } from "./AnimeProfileAvatar";
import { ModeToggle } from "./ui/theme-toggle";
import { Button } from "./ui/button";
import { Heart, Home, Grid3x3 } from "lucide-react";
import { useFavoritesStore } from "@/lib/store";
import { usePathname } from "next/navigation";

export default function AnimeHeader() {
  const { favorites } = useFavoritesStore();
  const pathname = usePathname();

  return (
    <header className="w-full flex px-4 justify-center sticky top-0 sm:top-3 z-50 container mx-auto">
      <div className="flex justify-between w-full sm:px-6 py-4  bg-gray-100/85 dark:bg-gray-800/85 sm:rounded-full items-center text-center backdrop-blur-md">
        <Link
          href="/"
          className="font-bold text-lg sm:text-xl hover:opacity-80 transition-opacity"
        >
          AnimeXplorer
        </Link>

        <div className="flex flex-row gap-2 sm:gap-3 items-center">
          {/* Navigation */}
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="h-9 w-9 sm:w-auto sm:px-4 rounded-full"
            >
              <Home className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>

          <Link href="/browse">
            <Button
              variant={pathname === "/browse" ? "default" : "ghost"}
              size="sm"
              className="h-9 w-9 sm:w-auto sm:px-4 rounded-full"
            >
              <Grid3x3 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Browse</span>
            </Button>
          </Link>

          <Link href="/favorites">
            <Button
              variant={pathname === "/favorites" ? "default" : "ghost"}
              size="sm"
              className="h-9 w-9 sm:w-auto sm:px-4 relative rounded-full"
            >
              <Heart
                className={`w-4 h-4 sm:mr-2 ${
                  pathname === "/favorites" ? "fill-current" : ""
                }`}
              />
              <span className="hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length > 99 ? "99+" : favorites.length}
                </span>
              )}
            </Button>
          </Link>

          <ModeToggle />
          <AnimeProfileAvatar />
        </div>
      </div>
    </header>
  );
}

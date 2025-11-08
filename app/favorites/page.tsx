import type { Metadata } from "next";
import FavoritesAnimeList from "@/components/FavoritesAnimeList";

export const metadata: Metadata = {
  title: "My Favorites",
  description:
    "View and manage your favorite anime. Keep track of anime you want to watch or have enjoyed.",
  openGraph: {
    title: "My Favorites | Anime Explorer",
    description:
      "View and manage your favorite anime. Keep track of anime you want to watch or have enjoyed.",
    url: "/favorites",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Favorites | Anime Explorer",
    description:
      "View and manage your favorite anime. Keep track of anime you want to watch or have enjoyed.",
  },
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-4 sm:pt-8">
        <header className="mb-6">
          <h2>My Favorites</h2>
        </header>
        <FavoritesAnimeList />
      </div>
    </div>
  );
}

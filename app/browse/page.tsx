import type { Metadata } from "next";
import BrowseAnimeList from "@/components/BrowseAnimeList";
import BackToTop from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Browse All Anime",
  description:
    "Browse and filter through thousands of anime titles. Search by genre, type, status, and more to find your next anime to watch.",
  openGraph: {
    title: "Browse All Anime | Anime Explorer",
    description:
      "Browse and filter through thousands of anime titles. Search by genre, type, status, and more to find your next anime to watch.",
    url: "/browse",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse All Anime | Anime Explorer",
    description:
      "Browse and filter through thousands of anime titles. Search by genre, type, status, and more to find your next anime to watch.",
  },
};

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-4 sm:pt-8">
        <header className="mb-6">
          <h2>Browse All Anime</h2>
        </header>
        <BrowseAnimeList />
      </div>
      {/* Back to top button */}
      <BackToTop />
    </div>
  );
}

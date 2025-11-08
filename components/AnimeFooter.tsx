import Link from "next/link";
import { Github, ExternalLink, Heart, Code, Database } from "lucide-react";

export default function AnimeFooter() {
  return (
    <footer className="w-full bg-background border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">AnimeXplorer</h3>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Explore
            </h4>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Anime
              </Link>
              <Link
                href="/favorites"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                My Favorites
              </Link>
            </nav>
          </div>

          {/* Technical Stack */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Built With
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Code size={14} />
                <span>Next.js 16 + TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <Database size={14} />
                <span>TanStack React Query</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={14} />
                <span>Tailwind CSS + Radix UI</span>
              </div>
            </div>
          </div>

          {/* Data Source & Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide">
              Data & Source
            </h4>
            <div className="space-y-2">
              <a
                href="https://docs.api.jikan.moe/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink size={14} />
                <span>Jikan API v4</span>
              </a>
              <a
                href="https://myanimelist.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink size={14} />
                <span>MyAnimeList</span>
              </a>
              <a
                href="https://github.com/cyphr-dev/cyphr-animexplorer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={14} />
                <span>Source Code</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>&copy; 2025 AnimeXplorer. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs">
                Made with{" "}
                <Heart size={12} className="inline mx-1 text-red-500" /> by {""}
                <a
                  href="https://cyphr.my"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cyphr
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

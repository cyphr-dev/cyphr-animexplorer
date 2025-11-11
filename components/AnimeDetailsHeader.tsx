import { Anime } from "@/lib/types/anime";

export default function AnimeDetailsHeader({ anime }: { anime: Anime }) {
  return (
    <>
      {anime.trailer?.embed_url && (
        <div className="relative aspect-video w-full rounded-lg overflow-clip">
          <iframe
            src={anime.trailer.embed_url}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${anime.title} Trailer`}
          />
        </div>
      )}
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Anime, Character } from "@/lib/types/anime";

interface AnimeInfoTabProps {
  anime: Anime;
  characters: Character[];
}

export function AnimeInfoTab({ anime, characters }: AnimeInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Synopsis Section */}
      {anime.synopsis && (
        <>
          <div className="flex flex-col gap-6">
            <h3>Synopsis</h3>
            <p className="text-muted-foreground">{anime.synopsis}</p>
          </div>
          <hr />
        </>
      )}
      {/* Background Section */}
      {anime.background && (
        <>
          <div className="flex flex-col gap-6">
            <h3>Background</h3>
            <p className="text-muted-foreground leading-relaxed">
              {anime.background}
            </p>
          </div>
          <hr />
        </>
      )}

      {/* Additional Info Card */}
      <>
        <div className="flex flex-col gap-6">
          <h3>Additional Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {anime.source && (
              <div>
                <p className="text-muted-foreground">Source</p>
                <p className="font-medium">{anime.source}</p>
              </div>
            )}
            {anime.season && anime.year && (
              <div>
                <p className="text-muted-foreground">Season</p>
                <p className="font-medium capitalize">
                  {anime.season} {anime.year}
                </p>
              </div>
            )}
            {anime.members && (
              <div>
                <p className="text-sm text-muted-foreground">Members</p>
                <p className="font-medium">{anime.members.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
        <hr />
      </>

      {/* Characters Section */}
      {characters && characters.length > 0 && (
        <>
          <div className="flex flex-col gap-6">
            <h3>Characters & Voice Actors</h3>

            <div className="grid grid-cols-1">
              {characters.slice(0, 12).map((char) => (
                <div
                  key={char.character.mal_id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Character Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image
                        src={
                          char.character.images.webp.image_url ||
                          char.character.images.jpg.image_url
                        }
                        alt={char.character.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {char.character.url ? (
                        <Link
                          href={char.character.url}
                          target="_blank"
                          className="hover:text-primary transition-colors line-clamp-1"
                        >
                          <h5>{char.character.name}</h5>
                        </Link>
                      ) : (
                        <h5 className="line-clamp-1">{char.character.name}</h5>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {char.role}
                      </p>
                    </div>
                  </div>

                  {/* Voice Actor Info */}
                  {char.voice_actors && char.voice_actors.length > 0 && (
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <div className="text-right min-w-0">
                        {char.voice_actors[0].person.url ? (
                          <Link
                            href={char.voice_actors[0].person.url}
                            target="_blank"
                            className="hover:text-primary transition-colors line-clamp-1 block"
                          >
                            <h5>{char.voice_actors[0].person.name}</h5>
                          </Link>
                        ) : (
                          <span className="line-clamp-1 block">
                            <h5>{char.voice_actors[0].person.name}</h5>
                          </span>
                        )}
                        <p className="text-muted-foreground">
                          {char.voice_actors[0].language}
                        </p>
                      </div>
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted shrink-0">
                        <Image
                          src={char.voice_actors[0].person.images.jpg.image_url}
                          alt={char.voice_actors[0].person.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

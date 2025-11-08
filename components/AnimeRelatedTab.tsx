import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeCard } from "@/components/AnimeCard";
import { Anime, AnimeRelation } from "@/lib/types/anime";

interface AnimeRelatedTabProps {
  relations: AnimeRelation[] | null;
  relatedAnimeData: Anime[];
}

export function AnimeRelatedTab({
  relations,
  relatedAnimeData,
}: AnimeRelatedTabProps) {
  // Check if we have any anime relations
  const hasAnimeRelations =
    relations &&
    relations.length > 0 &&
    relations.some((rel) => rel.entry.some((entry) => entry.type === "anime"));

  if (!hasAnimeRelations) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No related anime found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h3>Related Anime</h3>

        <Tabs
          defaultValue={
            relations.find((rel) =>
              rel.entry.some((entry) => entry.type === "anime")
            )?.relation
          }
          className="w-full"
        >
          <TabsList className="w-full justify-start flex-wrap h-auto">
            {relations.map((relation, index) => {
              const animeEntries = relation.entry.filter(
                (entry) => entry.type === "anime"
              );
              if (animeEntries.length === 0) return null;

              return (
                <TabsTrigger
                  key={index}
                  value={relation.relation}
                  className="capitalize"
                >
                  {relation.relation}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {relations.map((relation, index) => {
            const animeEntries = relation.entry.filter(
              (entry) => entry.type === "anime"
            );

            if (animeEntries.length === 0) return null;

            return (
              <TabsContent
                key={index}
                value={relation.relation}
                className="mt-6"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {animeEntries.map((entry) => {
                    const animeData = relatedAnimeData.find(
                      (a) => a.mal_id === entry.mal_id
                    );

                    // If we have the full anime data, use AnimeCard
                    if (animeData) {
                      return <AnimeCard key={entry.mal_id} anime={animeData} />;
                    }

                    // Fallback for when we don't have full anime data
                    return (
                      <Link
                        key={entry.mal_id}
                        href={`/browse/anime/${entry.mal_id}`}
                        className="group block"
                      >
                        <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                          <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No Image
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h5 className="text-sm font-medium line-clamp-2">
                              {entry.name}
                            </h5>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

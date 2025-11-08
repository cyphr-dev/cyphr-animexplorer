import { JikanResponse } from "@/lib/types/anime";
import { jikanRateLimiter } from "./rateLimiter";

const JIKAN_API_BASE_URL = "https://api.jikan.moe/v4";

// Helper function to handle rate limit errors and retries
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries: number = 3
): Promise<Response> {
  return jikanRateLimiter.execute(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);

        if (response.status === 429) {
          // Rate limited, wait longer before retry
          const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
          console.log(
            `🚦 Jikan API rate limit hit. Waiting ${waitTime}ms before retry ${
              i + 1
            }/${retries}...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        return response;
      } catch (error) {
        if (i === retries - 1) throw error;
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw new Error(`Failed to fetch after ${retries} retries`);
  });
}

export interface FetchAnimeParams {
  page?: number;
  limit?: number;
  q?: string; // search query
  type?: "tv" | "movie" | "ova" | "special" | "ona" | "music";
  status?: "airing" | "complete" | "upcoming";
  rating?: "g" | "pg" | "pg13" | "r17" | "r" | "rx";
  sfw?: boolean; // safe for work - filters out hentai content
  min_score?: number;
  max_score?: number;
  genres?: string; // comma separated genre IDs
  order_by?:
    | "mal_id"
    | "title"
    | "start_date"
    | "end_date"
    | "episodes"
    | "score"
    | "scored_by"
    | "rank"
    | "popularity"
    | "members"
    | "favorites";
  sort?: "asc" | "desc";
}

export async function fetchAnimeList(
  params: FetchAnimeParams = {}
): Promise<JikanResponse> {
  try {
    const {
      page = 1,
      limit = 10,
      q,
      type,
      status,
      rating,
      sfw,
      min_score,
      max_score,
      genres,
      order_by,
      sort,
    } = params;

    const url = new URL(`${JIKAN_API_BASE_URL}/anime`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("limit", limit.toString());

    if (q) url.searchParams.append("q", q);
    if (type) url.searchParams.append("type", type);
    if (status) url.searchParams.append("status", status);
    if (rating) url.searchParams.append("rating", rating);
    if (sfw !== undefined) url.searchParams.append("sfw", sfw.toString());
    if (min_score) url.searchParams.append("min_score", min_score.toString());
    if (max_score) url.searchParams.append("max_score", max_score.toString());
    if (genres) url.searchParams.append("genres", genres);
    if (order_by) url.searchParams.append("order_by", order_by);
    if (sort) url.searchParams.append("sort", sort);

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime data: ${response.statusText}`);
    }

    const data: JikanResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching anime:", error);
    throw error;
  }
}

export async function fetchAnimeById(id: number) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}`;

    const response = await fetchWithRetry(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime details: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime details:", error);
    throw error;
  }
}

// Fetch top anime by filter
export async function fetchTopAnime(
  filter?: "airing" | "upcoming" | "bypopularity" | "favorite"
) {
  try {
    const url = new URL(`${JIKAN_API_BASE_URL}/top/anime`);
    if (filter) {
      url.searchParams.append("filter", filter);
    }
    url.searchParams.append("limit", "10");

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch top anime: ${response.statusText}`);
    }

    const data: JikanResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching top anime:", error);
    throw error;
  }
}

// Fetch anime by type and status
export async function fetchAnimeByTypeAndStatus(
  type: "tv" | "movie" | "ova" | "special" | "ona" | "music",
  status?: "airing" | "complete" | "upcoming"
) {
  try {
    const url = new URL(`${JIKAN_API_BASE_URL}/anime`);
    url.searchParams.append("type", type);
    if (status) {
      url.searchParams.append("status", status);
    }
    url.searchParams.append("order_by", "start_date");
    url.searchParams.append("sort", "desc");
    url.searchParams.append("limit", "10");

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime by type: ${response.statusText}`);
    }

    const data: JikanResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime by type:", error);
    throw error;
  }
}

// Fetch currently airing anime
export async function fetchCurrentlyAiring() {
  try {
    const url = new URL(`${JIKAN_API_BASE_URL}/seasons/now`);
    url.searchParams.append("limit", "10");

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch airing anime: ${response.statusText}`);
    }

    const data: JikanResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching airing anime:", error);
    throw error;
  }
}

// Fetch all genres
export async function fetchGenres() {
  try {
    const url = `${JIKAN_API_BASE_URL}/genres/anime`;

    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
}

// Fetch anime relations (sequels, prequels, etc.)
export async function fetchAnimeRelations(id: number) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}/relations`;

    const response = await fetchWithRetry(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch anime relations: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime relations:", error);
    return []; // Return empty array instead of throwing to prevent page crash
  }
}

// Fetch anime characters
export async function fetchAnimeCharacters(id: number) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}/characters`;

    const response = await fetchWithRetry(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch anime characters: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime characters:", error);
    return []; // Return empty array instead of throwing to prevent page crash
  }
}

// Fetch multiple anime by IDs (for getting images of related anime)
export async function fetchAnimeByIds(ids: number[]) {
  try {
    // Fetch anime data sequentially with delays to avoid rate limiting
    const animeData = [];

    for (const id of ids) {
      try {
        const response = await fetch(`${JIKAN_API_BASE_URL}/anime/${id}`, {
          next: { revalidate: 3600 },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            animeData.push(data.data);
          }
        }

        // Add a small delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 350));
      } catch (error) {
        console.error(`Error fetching anime ${id}:`, error);
        // Continue with next anime even if one fails
      }
    }

    return animeData;
  } catch (error) {
    console.error("Error fetching anime by IDs:", error);
    return [];
  }
}

// Fetch anime pictures (promotional images, screenshots)
export async function fetchAnimePictures(id: number) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}/pictures`;

    const response = await fetchWithRetry(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime pictures: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime pictures:", error);
    return [];
  }
}

// Fetch anime videos (promotional videos, music videos, episodes previews)
export async function fetchAnimeVideos(id: number) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}/videos`;

    const response = await fetchWithRetry(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime videos: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime videos:", error);
    return null;
  }
}

// Fetch anime statistics
export async function fetchAnimeStatistics(id: number) {
  try {
    const url = `${JIKAN_API_BASE_URL}/anime/${id}/statistics`;

    const response = await fetchWithRetry(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch anime statistics: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching anime statistics:", error);
    return null;
  }
}

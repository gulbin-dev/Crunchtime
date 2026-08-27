import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";
import { Genres } from "@utils/types";

// fetching list of movie or tv genres from TMDB
export default function useGenres(media: "movie" | "tv") {
  const { data, isLoading, error } = useSWR<Genres>(
    `api/${media === "movie" ? "movie-genres" : "tv-genres"}`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );
  return {
    genres: data,
    isLoading,
    error,
  };
}

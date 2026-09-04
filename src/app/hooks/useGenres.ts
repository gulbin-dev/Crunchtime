import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";
import { Genres } from "@utils/types";
import { useAbortController } from "./useAbortController";

// fetching list of movie or tv genres from TMDB
export default function useGenres(media: "movie" | "tv") {
  const signal = useAbortController([media]);

  const { data, isLoading, error } = useSWR<Genres>(
    `api/${media === "movie" ? "movie-genres" : "tv-genres"}`,
    (url) => fetcher(url, signal),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      suspense:false,
    },
  );
  return {
    genres: data,
    isLoading,
    error,
  };
}

import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";
import { Genres } from "@utils/types";

// fetching list of movie or tv genres from TMDB
export default function useGenres() {
  const { data: movieGenres, error: movieError } = useSWR<Genres>(
    "api/movie-genres",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      suspense: false,
    },
  );
  const { data: tvGenres, error: tvError } = useSWR<Genres>(
    "api/movie-genres",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      suspense: false,
    },
  );
  return {
    movieGenres: movieGenres,
    tvGenres: tvGenres,
    genreError: tvError | movieError,
  };
}

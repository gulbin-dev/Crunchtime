import useSWR from "swr";
import { useMemo } from "react";
import { fetcher } from "@utils/swr/fetcher";
import { Genres, Genre } from "@utils/types/types";

export interface ParamType {
  movie: Genres | undefined;
  tv: Genres | undefined;
}

// fetching list of movie or tv genres from TMDB
export default function useGenres() {
  const { data: movieGenres } = useSWR<Genres>("api/movie-genres", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    suspense: false,
  });
  const { data: tvGenres } = useSWR<Genres>("api/tv-genres", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    suspense: false,
  });

  const genres = useMemo(
    () => aggregateGenre({ movie: movieGenres, tv: tvGenres }),
    [movieGenres, tvGenres],
  );

  return genres;
}

const aggregateGenre = ({ movie, tv }: ParamType): Genre[] => {
  const hasMovie = movie && !Object.hasOwn(movie, "error");
  const hasTv = tv && !Object.hasOwn(tv, "error");

  if (!hasMovie && !hasTv) return [];
  if (hasMovie && !hasTv) return [...movie.genres];
  if (!hasMovie && hasTv) return [...tv.genres];

  const mergeData = [...movie!.genres, ...tv!.genres];

  // 3. Deduplicate by ID
  return mergeData.filter(
    (item, index, arr) =>
      index === arr.findIndex((iterateItem) => iterateItem.id === item.id),
  );
};

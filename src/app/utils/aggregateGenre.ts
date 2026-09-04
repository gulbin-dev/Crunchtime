import { Genres } from "./types";

export default function aggregateGenre(
  movieGenreData: Genres | undefined,
  tvGenreData: Genres | undefined,
) {
  if (
    !movieGenreData ||
    !tvGenreData ||
    (movieGenreData && !Object.hasOwn(movieGenreData, "genres")) ||
    (tvGenreData && !Object.hasOwn(tvGenreData, "genres"))
  )
    return [];
  const mergeData = [...movieGenreData.genres, ...tvGenreData.genres];
  return mergeData.filter(
    (item, index, arr) =>
      index === arr.findIndex((iterateITem) => iterateITem.id === item.id),
  );
}

import { Genres } from "./types";

export default function aggregateGenre(
  movieGenreData: Genres | undefined,
  tvGenreData: Genres | undefined,
) {
  if (
    !movieGenreData ||
    !tvGenreData ||
    Object.hasOwn(movieGenreData, "message") ||
    Object.hasOwn(tvGenreData, "message")
  )
    return [];

  const mergeData = [...movieGenreData.genres, ...tvGenreData.genres];
  return mergeData.filter(
    (item, index, arr) =>
      index === arr.findIndex((iterateITem) => iterateITem.id === item.id),
  );
}

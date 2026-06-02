import { Genre } from "./types";

export default function aggregateGenre(
  movieGenreData: Genre[] | undefined,
  tvGenreData: Genre[] | undefined,
) {
  if (!movieGenreData || !tvGenreData) return [];
  const mergeData = [...movieGenreData, ...tvGenreData];
  return mergeData.filter(
    (item, index, arr) =>
      index === arr.findIndex((iterateITem) => iterateITem.id === item.id),
  );
}

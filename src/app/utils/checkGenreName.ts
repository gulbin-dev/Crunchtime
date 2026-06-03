import { Genre } from "./types";
export function checkGenreName(item: Genre, genre: string[]) {
  const hastwoGenres = item.name.match(/&/g);
  if (hastwoGenres) {
    const firstGenre: string = item.name.replace(
      /(^[\w\-]+)\s+&\s+([\w\-]+)/g,
      "$1",
    );
    const secondGenre: string = item.name.replace(
      /(^[\w\-]+)\s+&\s+([\w\-]+)/g,
      "$2",
    );
    const matchFirst = genre.includes(firstGenre);
    const matchFsecond = genre.includes(secondGenre);
    if (matchFirst === true || matchFsecond === true) {
      return true;
    }
  }
  return genre.includes(item.name);
}

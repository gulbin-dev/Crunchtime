import { PopularResponseType } from "./types/modefiedTypes";
import {
  Preview,
  MediaTypes,
  Movie,
  TV,
  MoviePreview,
  TVPreview,
  Genre,
} from "./types/types";

interface NormalizedData {
  normalizeTitle: string;
  runtime?: number;
  number_of_seasons?: number;
  genre_names: Genre[];
}

/**
 * @description - Normalizing the prop difference of Movie | TV and  MoviePreview | TVPreview data props
 * @param - Objects from API responses
 * @return - returing the properties that includes `addTitle` property with it
 */

//  helper function for both `normalizeData` and `normalizePreviewData` functions

const helperFunction = (
  data: Movie | TV | MoviePreview | TVPreview | PopularResponseType,
  genres?: Genre[],
): NormalizedData => {
  const genreNames =
    genres?.filter((item) => data.genre_ids.includes(item.id)) ?? [];
  if ("title" in data) {
    return {
      normalizeTitle: data.title,
      genre_names: [...genreNames],
      ...("runtime" in data &&
        data.runtime !== undefined && { runtime: data.runtime }),
    };
  }
  return {
    normalizeTitle: data.name,
    genre_names: [...genreNames],
    ...("number_of_seasons" in data &&
      data.number_of_seasons !== undefined && {
        number_of_seasons: data.number_of_seasons,
      }),
  };
};

export const normalizeData = (
  data: MediaTypes | PopularResponseType[] | undefined,
  aggregateGenre?: Genre[],
): PopularResponseType[] | never[] => {
  if (!data) return [];
  return data.map((data) => {
    const normalized = helperFunction(data, aggregateGenre);
    const result = { ...data, normalized };
    return result;
  });
};

export const normalizePreviewData = (data: Preview) => {
  const normalized = helperFunction(data);
  const result: Preview = { ...data, normalized };
  return result;
};

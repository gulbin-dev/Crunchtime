import {
  Preview,
  MediaTypes,
  Movie,
  TV,
  MoviePreview,
  TVPreview,
} from "./types";

/**
 * @description - Normalizing the prop difference of Movie | TV and  MoviePreview | TVPreview data props
 * @param - Objects from API responses
 * @return - returing the properties that includes `addTitle` property with it
 */

//  helper function for both `normalizeData` and `normalizePreviewData` functions
function helperFunction(data: Movie | TV | MoviePreview | TVPreview) {
  let normalizeTitle = "";
  let normalizeMovie = 0;
  let normalizeTV = 0;
  if ("original_title" in data) {
    normalizeTitle = data.title;
    normalizeMovie = (data as MoviePreview).runtime;
    return { normalizeTitle, normalizeMovie };
  } else if ("original_name" in data) {
    normalizeTitle = data.name;
    normalizeTV = (data as TVPreview).number_of_seasons;
    return { normalizeTitle, normalizeTV };
  }
}

export function normalizeData(data: MediaTypes) {
  if (!data) return [];
  return data.map((data) => {
    const normalized = helperFunction(data);
    const result: TV | Movie = { ...data, normalized };
    return result;
  });
}

export function normalizePreviewData(data: Preview) {
  const normalized = helperFunction(data);
  const result: Preview = { ...data, normalized };
  return result;
}

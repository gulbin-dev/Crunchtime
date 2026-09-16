import { BaseData, TV, Movie } from "@utils/types/types";

type Popular = Pick<
  BaseData,
  | "id"
  | "backdrop_path"
  | "media_type"
  | "normalized"
  | "genre_ids"
  | "popularity"
  | "poster_path"
  | "blurDataUrl"
  | "vote_average"
>;

type CardPoster = Pick<
  BaseData,
  "id" | "normalized" | "poster_path" | "blurDataUrl" | "vote_average"
>;

type UniqueFields = Pick<Movie, "title"> | Pick<TV, "name">;

export type PopularResponseType = Popular & UniqueFields;
export type CardPosterType = CardPoster & UniqueFields;

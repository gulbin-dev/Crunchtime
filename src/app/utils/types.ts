//  common Movie and TV data props
interface BaseData {
  adult?: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  media_type?: "movie" | "tv";
  vote_average: number;
  vote_count: number;
  normalized?: {
    normalizeTitle: string;
    normalizeMovie?: number;
    normalizeTV?: number;
  };
  blurDataUrl: string;
}

//  tv specific data props
export interface TV extends BaseData {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

//  movie specific data props
export interface Movie extends BaseData {
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

//  Genres data props for both Movie and Tv
export interface Genre {
  id: number;
  name: string;
}
//  array of Genre data type
export interface Genres {
  genres: Genre[];
}

// Genre response type from useSWR
export interface GenreResponseSWR {
  data: Genres;
}

interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}
interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}
interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Videos data type
interface Videos {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

//  Image data type
interface Images {
  aspect_ratio: number;
  height: number;
  iso_3166_1: string;
  iso_639_1: string;
  file_path: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
}
// common Cast and Crew data type
interface Credit {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
}

//  Cast data type
interface Cast extends Credit {
  cast_id: number;
  character: string;
  order: number;
}

//  Crew data type
interface Crew extends Credit {
  department: string;
  job: string;
}

//  Review
export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number;
  };
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

interface TVSeriesCreator {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}
interface TVSeriesNetworks {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}
interface TVSeriesLastEpisode {
  id: number;
  name: string;
  overview: string;
  vote_average: 8.9;
  vote_count: 37;
  air_date: string;
  episode_number: 6;
  episode_type: string;
  production_code: "";
  runtime: 31;
  season_number: 1;
  show_id: 224372;
  still_path: string | null;
}
interface TVSeriesSeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

// Preview
interface BasePreview extends BaseData {
  genres: Genre[];
  homepage: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;

  videos: {
    results: Videos[];
  };
  images: {
    backdrops: Images[];
    logos: Images[];
    posters: Images[];
  };

  credits: {
    cast: Cast[];
    crew: Crew[];
  };
  recommendations: FetchResponse<MediaTypes>;
  similar: FetchResponse<MediaTypes>;
}

//  movie details
export interface MoviePreview extends BasePreview {
  belongs_to_collection: string | null;
  budget: number;
  imdb_id: string;
  revenue: number;
  runtime: number;
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

export interface TVPreview extends BasePreview {
  created_by: TVSeriesCreator[];
  episode_run_time: number[];
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: TVSeriesLastEpisode;
  next_episode_to_air: string | null;
  networks: TVSeriesNetworks[];
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: TVSeriesSeason[];
  type: string;
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

//  array of Movie and TV data types
export type MediaTypes = (Movie | TV)[];

//  discover movie/tv response
export interface FetchResponse<T> {
  id?: number;
  page: number;
  results: T;
  total_pages: number;
  total_results: number;
}

export interface Response<T> {
  data: T | [];
  error: {
    state: boolean;
    type: string | undefined;
    status: number | undefined;
    message: string | undefined;
  };
}

export type Preview = MoviePreview | TVPreview;

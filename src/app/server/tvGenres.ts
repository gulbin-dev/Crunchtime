import { Response, Genres, Genre } from "@utils/types";
import { cacheLife } from "next/cache";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.Read_Access_Token}`,
    cache: "force-cache",
  },
};
export async function tvGenreList(): Promise<Response<Genre[]>> {
  "use cache";
  cacheLife("weeks");

  let response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/genre/tv/list`,
      options,
    );
    if (!response.ok) {
      return {
        data: [],
        error: {
          state: true,
          type: "HTTP_ERROR",
          status: response.status,
          message: "Failed to fetch data, please try again",
        },
      };
    }
    const data: Genres = await response.json();
    return {
      data: data.genres,
      error: {
        state: false,
        type: undefined,
        status: response?.status,
        message: undefined,
      },
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      data: [],
      error: {
        state: true,
        type: `${error.name}`,
        status: response?.status,
        message: `${error.message}, please try again`,
      },
    };
  }
}

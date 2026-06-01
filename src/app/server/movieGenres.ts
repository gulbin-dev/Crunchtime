import { Response, Genres } from "../utils/types";
import { cacheLife } from "next/cache";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.Read_Access_Token}`,
    cache: "force-cache",
  },
};
export async function movieGenreList(): Promise<Response<Genres>> {
  "use cache";
  cacheLife("weeks");

  let response;
  try {
    response = await fetch(
      "https://api.themoviedb.org/3/genre/movie/list",
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
    const data = await response.json();
    return {
      data: data,
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

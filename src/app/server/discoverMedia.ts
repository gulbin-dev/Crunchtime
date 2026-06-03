import { FetchResponse, MediaTypes, Response } from "@utils/types";
import { cacheTag } from "next/cache";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.Read_Access_Token}`,
  },
};
export async function discoverMedia(
  toFetch: string,
  genreParam: string[],
): Promise<Response<FetchResponse<MediaTypes>> | null> {
  "use cache";
  cacheTag("weeks");
  const genre = genreParam.join("|");

  let response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/${toFetch}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc${genre !== "" ? `&with_genres=${genre}` : ""}`,
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
      data: data.results,
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

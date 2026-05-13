import { FetchResponse } from "@utils/types";
import { cacheTag } from "next/cache";
import { MediaTypes, Response } from "../utils/types";
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
      `https://api.themoviedb.org/3/discover/${toFetch}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc${genre !== "" ? `&with_genres=${genre}` : ""}`,
      options,
    );
    if (!response.ok) {
      throw {
        data: undefined,
        error: {
          state: true,
          type: "HTTP_ERROR",
          status: response.status,
          message: "Failed to fetch data, please try again",
        },
      };
    }
    return await response.json();
  } catch (err: unknown) {
    const error = err as Error;
    throw {
      data: undefined,
      error: {
        state: true,
        type: `${error.name}`,
        status: response?.status,
        message: `${error.message}, please try again`,
      },
    };
  }
}

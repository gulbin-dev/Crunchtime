import { FetchResponse } from "@utils/types";
import { Response, MediaTypes } from "../utils/types";
import { cacheLife } from "next/cache";

//  defining Authorization for every 'GET' request
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.Read_Access_Token}`,
    cache: "force-cache",
  },
};

//  fetching list of   `Movie`, `Tv shows` and `People`
export async function trendingList(): Promise<
  Response<FetchResponse<MediaTypes>>
> {
  "use cache";
  cacheLife("weeks");
  let response;
  try {
    response = await fetch(
      "https://api.themoviedb.org/3/trending/all/week?language=en-US",
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

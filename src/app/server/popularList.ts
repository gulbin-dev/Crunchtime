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
export async function popularList(): Promise<Response<MediaTypes>> {
  "use cache";
  cacheLife("weeks");
  let response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/all/week?language=en-US`,
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
    const data: FetchResponse<MediaTypes> = await response.json();
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

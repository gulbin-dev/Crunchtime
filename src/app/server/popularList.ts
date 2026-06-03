import { FetchResponse } from "@utils/types";
import { Response, MediaTypes } from "../utils/types";
import { cacheLife } from "next/cache";
import { getPlaiceholder } from "plaiceholder";

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
    const dataBuffered = data.results.map(async (item) => {
      try {
        const buffer = await fetch(
          `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
        ).then(async (res) => Buffer.from(await res.arrayBuffer()));

        const { base64 } = await getPlaiceholder(buffer);

        return { ...item, blurDataUrl: base64 };
      } catch (e: unknown) {
        const error = e as Error;
        console.error("Error processing base64: ", error.message);
        return { ...item, blurDataUrl: "" };
      }
    });
    const resolvedData = await Promise.all(dataBuffered);

    return {
      data: resolvedData,
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

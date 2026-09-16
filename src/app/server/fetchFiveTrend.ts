import { getPlaiceholder } from "plaiceholder";
import { FetchResponse, MediaTypes } from "@utils/types/types";
import { PopularResponseType } from "@utils/types/modefiedTypes";

export default async function fetchFiveTrend(): Promise<PopularResponseType[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/all/week?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
      },
    );

    if (!response.ok) return [];

    const data: FetchResponse<MediaTypes> = await response.json();

    const dataBuffered = data.results
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map(async (item): Promise<PopularResponseType> => {
        let base64 = "";
        try {
          if (item.backdrop_path) {
            const res = await fetch(
              `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
            );

            if (res.ok) {
              const arrayBuffer = await res.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              const result = await getPlaiceholder(buffer);
              base64 = result.base64;
            }
          }
        } catch {
          base64 = "";
        }

        const sanitizedItem = {
          id: item.id,
          backdrop_path: item.backdrop_path,
          media_type: item.media_type,
          normalized: item.normalized,
          genre_ids: item.genre_ids,
          popularity: item.popularity,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          blurDataUrl: base64,
        };

        return "name" in item
          ? { ...sanitizedItem, name: item.name }
          : { ...sanitizedItem, title: item.title };
      });

    return await Promise.all(dataBuffered);
  } catch {
    return [];
  }
}

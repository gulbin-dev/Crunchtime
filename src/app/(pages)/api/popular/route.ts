import { NextRequest, NextResponse } from "next/server";
import { getPlaiceholder } from "plaiceholder";
import { FetchResponse, MediaTypes } from "@utils/types";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/trending/all/week?language=en-US`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
        signal: request.signal,
      },
    );
    if (!response.ok) {
      return NextResponse.json([]);
    }
    const data: FetchResponse<MediaTypes> = await response.json();
    const dataBuffered = data.results.map(async (item) => {
      try {
        const buffer = await fetch(
          `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`,
          { signal: request.signal },
        ).then(async (res) => Buffer.from(await res.arrayBuffer()));

        const { base64 } = await getPlaiceholder(buffer);

        return { ...item, blurDataUrl: base64 };
      } catch {
        return { ...item, blurDataUrl: "" };
      }
    });
    const resolvedData = await Promise.all(dataBuffered);

    return NextResponse.json(resolvedData);
  } catch {
    return NextResponse.json([]);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { normalizeData } from "@utils/normalizeData";
import { getPlaiceholder } from "plaiceholder";

export async function GET(request: NextRequest) {
  // 1. Parse URL search parameters
  const { searchParams } = request.nextUrl;
  const mediaType = searchParams.get("mediaType");
  const genre = searchParams.get("genre");

  // Validate parameters to prevent bad API requests
  if (!mediaType) {
    return NextResponse.json(
      { error: "Missing mediaType parameter" },
      { status: 400 },
    );
  }

  try {
    // 2. Fetch the catalog data from TMDB with AbortSignal support
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc${genre ? `&with_genres=${genre}` : ""}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
        signal: request.signal,
        // Revalidate every hour
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`TMDB API error status: ${response.status}`);
    }

    const data = await response.json();

    // 3. Transform data using your utility functions
    const normalized = data.results ? normalizeData(data.results) : [];

    // FIX: Map to an array of promises
    const promises = normalized.map(async (item) => {
      // Safely skip blur generation if backdrop image does not exist
      if (!item.backdrop_path) {
        return { ...item, blurDataUrl: "" };
      }

      try {
        const buffer = await fetch(
          `https://image.tmdb.org/t/p/w300${item.backdrop_path}`,
          { signal: request.signal },
        ).then(async (res) => Buffer.from(await res.arrayBuffer()));

        const { base64 } = await getPlaiceholder(buffer);

        return { ...item, blurDataUrl: base64 };
      } catch {
        return { ...item, blurDataUrl: "" };
      }
    });

    const dataBuffered = await Promise.all(promises);

    // 5. Respond with the processed data structure
    return NextResponse.json(dataBuffered);
  } catch {
    return NextResponse.json(
      { error: "Failed to process catalog data" },
      { status: 500 },
    );
  }
}

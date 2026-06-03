import { NextRequest, NextResponse } from "next/server";
import { normalizeData } from "@utils/normalizeData";

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
    // 2. Fetch the catalog data from TMDB
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc${genre ? `&with_genres=${genre}` : ""}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
        // Revalidate every hour instead of using the broken revalidateTag call
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`TMDB API error status: ${response.status}`);
    }

    const data = await response.json();

    // 3. Transform data using your utility functions
    const normalized = data.results ? normalizeData(data.results) : [];

    // 5. Respond with the processed data structure
    return NextResponse.json(normalized);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Catalog API failure:", err.message);
    return NextResponse.json(
      { error: "Failed to process catalog data" },
      { status: 500 },
    );
  }
}

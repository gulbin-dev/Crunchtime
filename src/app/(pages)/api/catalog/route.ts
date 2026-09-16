import { NextRequest, NextResponse } from "next/server";
import { normalizeData } from "@utils/normalizeData";
import { getPlaiceholder } from "plaiceholder";
import { mediaTypeChecker } from "@utils/serverPathChecker";
import { CardPosterType } from "@utils/types/modefiedTypes";

export async function GET(request: NextRequest) {
  // 1. Parse URL search parameters
  const { searchParams } = request.nextUrl;
  const mediaType = searchParams.get("mediaType");
  const genre = searchParams.get("genre");

  try {
    const genreIds = (genre ?? "")
      .split(/[|,]/)
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => /^\d+$/.test(value));
    const regexGenre = genreIds.join("|");
    const media = mediaTypeChecker(mediaType!);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/${media}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${regexGenre}`,
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

    const normalized = data.results ? normalizeData(data.results) : [];
    let base64 = "";
    const promises = normalized.map(async (item): Promise<CardPosterType> => {
      if (!item.backdrop_path) {
        return { ...item, blurDataUrl: "" };
      }

      try {
        const res = await fetch(
          `https://image.tmdb.org/t/p/w300${item.backdrop_path}`,
          { signal: request.signal },
        );
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const result = await getPlaiceholder(buffer);
          base64 = result.base64;
        }
      } catch {
        base64 = "";
      }

      const sanitized = {
        id: item.id,
        normalized: item.normalized,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        blurDataUrl: base64,
      };
      return "name" in item
        ? { ...sanitized, name: item.name }
        : { ...sanitized, title: item.title };
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

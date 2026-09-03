import { Genres } from "@utils/types";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
): Promise<NextResponse<Genres | { error: string }>> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/genre/tv/list`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
        signal: request.signal,
      },
    );
    const data: Genres = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

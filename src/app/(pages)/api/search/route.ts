import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query");
  const media = searchParams.get("media");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/search/${media}?query=${query}&include_adult=false&language=en-US&page=1`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.Read_Access_Token}`,
      },
      signal: request.signal,
    },
  );
  const data = await response.json();
  return NextResponse.json(data);
}

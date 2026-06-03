import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const media = searchParams.get("media");
  const id = searchParams.get("id");
  const page = searchParams.get("page");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/${media}/${id}/reviews?language=en-US&page=${page}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.Read_Access_Token}`,
      },
    },
  );

  const data = await response.json();
  return NextResponse.json(data);
}

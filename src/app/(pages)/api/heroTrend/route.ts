import { NextResponse } from "next/server";
export async function GET() {
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
  const data = await response.json();
  return NextResponse.json(data);
}

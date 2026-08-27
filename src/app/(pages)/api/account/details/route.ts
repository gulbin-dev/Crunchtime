import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tmdb_session_id")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/account?session_id=${sessionId}`,
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
  } catch {
    return NextResponse.json(
      { error: "It seems something went wrong." },
      { status: 500 },
    );
  }
}

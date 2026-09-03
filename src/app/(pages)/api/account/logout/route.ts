import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("tmdb_session_id")?.value;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/authentication/session`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
        signal: request.signal,
      },
    );
    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    cookieStore.delete("tmdb_session_id");
    return NextResponse.json(data);
  } catch (e) {
    console.error("Logout Route Error:", e); // Log the actual error to your terminal!

    return NextResponse.json(
      { error: "It seems something went wrong." },
      { status: 500 },
    );
  }
}

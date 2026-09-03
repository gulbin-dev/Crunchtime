import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/authentication/token/new`,
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
      return NextResponse.json(
        { error: "Failed to request a token" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "It seems something went wrong." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requestToken = searchParams.get("request_token");
  if (!requestToken) {
    return NextResponse.json(
      { error: "Missing request token" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/authentication/session/new`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.Read_Access_Token}`,
        },
        body: JSON.stringify({ request_token: requestToken }),
        signal: request.signal,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data?.status_message ?? "Failed to create a session" },
        { status: response.status },
      );
    }

    // 1. Create a redirect response instead of using next/navigation redirect
    const redirectUrl = new URL("/", request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);

    // OPTIONAL ADVANCED SECURITY: Encrypt the session_id here using a utility
    // function before saving it to the cookie. For now, we will store it securely.
    const sessionToken = data.session_id;

    // 2. Attach the secure cookie directly to the redirect response
    redirectResponse.cookies.set("tmdb_session_id", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", // Switched from 'lax' to 'strict' for maximum CSRF protection
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return redirectResponse;
  } catch {
    return NextResponse.json(
      { error: "It seems something went wrong." },
      { status: 500 },
    );
  }
}

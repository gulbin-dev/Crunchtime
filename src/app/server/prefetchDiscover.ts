import { NextRequest, NextResponse } from "next/server";

export async function preFetchDiscover(request: NextRequest) {
  const mediaType = request.nextUrl.searchParams.get("mediaType");
  const genre = request.nextUrl.searchParams.get("genre");

  if (!mediaType || !genre) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  let response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `bearer ${process.env.Read_Access_Token}`,
        },
      },
    );

    if (!response.ok) {
      return {
        data: [],
        error: {
          state: true,
          type: "HTTP_ERROR",
          status: response.status,
          message: "Failed to fetch data, please try again",
        },
      };
    }
    const data = await response.json();
    return {
      data: data.results,
      error: {
        state: false,
        type: undefined,
        status: response?.status,
        message: undefined,
      },
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      data: [],
      error: {
        state: true,
        type: `${error.name}`,
        status: response?.status,
        message: `${error.message}, please try again`,
      },
    };
  }
}

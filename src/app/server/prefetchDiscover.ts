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
      `https://api.themoviedb.org/3/discover/${mediaType}?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genre}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `bearer ${process.env.Read_Access_Token}`,
        },
      },
    );

    if (!response.ok) {
      throw {
        data: undefined,
        error: {
          state: true,
          type: "HTTP_ERROR",
          status: response.status,
          message: "Failed to fetch data, please try again",
        },
      };
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    throw {
      data: undefined,
      error: {
        state: true,
        type: `${error.name}`,
        status: response?.status,
        message: `${error.message}, please try again`,
      },
    };
  }
}

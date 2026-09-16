import { NextRequest, NextResponse } from "next/server";
import {
  mediaTypeChecker,
  preventPathTraversal,
  pageNumberChecker,
} from "@utils/serverPathChecker";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mediaParams = searchParams.get("media");
  const idParams = searchParams.get("id");
  const pageParams = searchParams.get("page") || "1";

  const media = mediaTypeChecker(mediaParams!);
  const id = preventPathTraversal(idParams!);
  const page = pageNumberChecker(pageParams);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/${media}/${id}?append_to_response=videos,images,credits,recommendations,similar&language=en-US&page=${page}`,
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

"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { normalizePreviewData } from "@utils/normalizeData";
import UI_Brick from "./UI/UI_Brick";
import { handleRuntime } from "@utils/previewHelpers";
import CardPosterImagePlaceholder from "./UI/CardPosterImagePlaceholder";
import { useAppSelector } from "@hooks/redux-typed-hooks";

import usePreview from "@hooks/usePreviewDetails";
export default function MediaBanner() {
  const params = useParams();
  const { data } = usePreview(params.media, params.id, {
    suspense: true,
  });
  const theme = useAppSelector((state) => state.theme.theme);
  const normalize = data && normalizePreviewData(data);
  if (!normalize) return null;
  const posterPath = normalize.images?.posters?.[0]?.file_path ?? null;

  return (
    <div
      data-theme={theme}
      className="relative grid grid-cols-[max-content_1fr] grid-rows-[auto_auto] gap-x-2"
      aria-labelledby={`title-banner ${normalize.media_type}`}
    >
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w780${posterPath}`}
          alt=""
          width={80}
          height={142}
          className="col-start-1 row-span-full aspect-9/16 place-self-start rounded-lg object-contain"
        />
      ) : (
        <div className="col-start-1 row-span-full aspect-9/16 h-14 w-10 rounded-lg">
          <CardPosterImagePlaceholder />
        </div>
      )}

      <div className="col-start-2 col-end-3 row-start-1 flex flex-col gap-1">
        <h1 className="text-heading-md font-bold">
          {normalize.normalized?.normalizeTitle}
        </h1>
        <p>
          <span
            aria-label={`Rating: ${normalize?.vote_average?.toFixed(1) ?? "N/A"}`}
          >
            {normalize?.vote_average?.toFixed(1) ?? "N/A"}
          </span>
          <span className="before:mr-0.5 before:ml-0.5 before:content-['•']">
            {"runtime" in normalize
              ? handleRuntime(normalize.normalized?.runtime)
              : `Season ${normalize.normalized?.number_of_seasons}`}
          </span>
        </p>
      </div>
      <ul className="col-start-2 row-start-2 mt-1 flex flex-wrap gap-1">
        {normalize?.genres?.map((item) => (
          <li key={item.id}>
            <UI_Brick
              value={item.name}
              style="bg-gray-shade/40"
              aria-label={`${item.name} genre`}
            />
          </li>
        )) ?? null}
      </ul>
    </div>
  );
}

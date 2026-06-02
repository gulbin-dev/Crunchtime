"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { normalizePreviewData } from "@utils/normalizeData";
import UI_Brick from "./UI/UI_Brick";
import { handleRuntime } from "@utils/previewHelpers";
import { Preview } from "@utils/types";
import CardPosterImagePlaceholder from "./UI/CardPosterImagePlaceholder";
import { fetcher } from "@utils/swr/fetcher";
import { useAppSelector } from "../hooks/redux-typed-hooks";
export default function MediaBanner() {
  const params = useParams();
  const { data } = useSWR(
    `/preview/${params.media}/${params.id}/api/preview?media=${params.media}&id=${params.id}`,
    (url) => fetcher<Preview>(url),
    { suspense: true },
  );
  const theme = useAppSelector((state) => state.theme.theme);
  const normalize = data && normalizePreviewData(data);
  if (normalize === undefined) return null;
  const posterPath = normalize.images.posters[0]?.file_path;
  return (
    <div
      data-theme={theme}
      className="flex gap-2 px-3 relative"
      role="region"
      aria-labelledby={`title-banner ${normalize.media_type}`}
    >
      {posterPath ? (
        <Image
          src={`https://image.tmdb.org/t/p/w780${posterPath}`}
          alt=""
          width={80}
          height={142}
          className="aspect-9/16 object-contain place-self-start"
        />
      ) : (
        <div className="w-10 h-14 aspect-9/16">
          <CardPosterImagePlaceholder />
        </div>
      )}

      <div className="w-full">
        <h1 className="text-heading-md font-bold">
          {normalize.normalized?.normalizeTitle}
        </h1>
        <p>
          <span aria-label={`Rating: ${normalize.vote_average.toFixed(1)}`}>
            {normalize.vote_average.toFixed(1)}
          </span>
          <span className="before:mr-0.5 before:ml-0.5 before:content-['•'] ">
            {"runtime" in normalize
              ? handleRuntime(normalize.normalized?.normalizeMovie)
              : `Season ${normalize.normalized?.normalizeTV}`}
          </span>
        </p>
        <ul className="flex flex-wrap gap-1 mt-1">
          {normalize.genres.map((item) => (
            <li key={item.id}>
              <UI_Brick
                value={item.name}
                style="bg-gray-shade/40"
                aria-label={`${item.name} genre`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

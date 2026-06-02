"use client";
import Image from "next/image";
import { normalizeData } from "@utils/normalizeData";
import Link from "next/link";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";
import { MediaTypes, FetchResponse } from "@utils/types";
import CardPosterImagePlaceholder from "@/app/components/UI/CardPosterImagePlaceholder";
import LoaderCardPoster from "@/app/components/UI/LoaderCardPoster";
import { fetcher } from "@utils/swr/fetcher";

export default function CardPoster({
  catalog,
  filteredGenre,
}: {
  catalog: string;
  filteredGenre: string;
}) {
  const { data, isLoading, isValidating, error } = useSWR(
    `/api/catalog?mediaType=${catalog}&genre=${filteredGenre}`,
    (url) => fetcher<FetchResponse<MediaTypes>>(url),
  );
  if (error) return <LoaderCardPoster />;
  const normalized = data ? normalizeData(data.results) : [];
  const cards = normalized.slice(0, 10).map((item, i) => {
    return isValidating || isLoading ? (
      <li key={i}>
        <LoaderCardPoster />
      </li>
    ) : (
      <li key={item.id}>
        <Link
          href={`/preview/${catalog}/${item.id}`}
          aria-label={`View details for ${item.normalized?.normalizeTitle}`}
        >
          <div className="group rounded-xl relative min-w-20 h-35">
            {item.poster_path === null ? (
              <div>
                <CardPosterImagePlaceholder />
              </div>
            ) : (
              <Image
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 20vw"
                className="rounded-xl"
              />
            )}
            <div className="text-foreground-dark bg-secondary/55 backdrop-blur-sm absolute bottom-0 w-full rounded-b-xl h-10 p-1.5 group-hover:bg-secondary transition-colors duration-300">
              {" "}
              <h3 className="line-clamp-2">
                {item.normalized?.normalizeTitle}
              </h3>
            </div>
          </div>
        </Link>
      </li>
    );
  });

  return <>{cards}</>;
}

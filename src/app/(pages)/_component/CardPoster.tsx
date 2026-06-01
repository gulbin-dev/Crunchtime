"use client";
import Image from "next/image";
import { normalizeData } from "@utils/normalizeData";
import Link from "next/link";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";
import { MediaTypes, FetchPosterFromSWR } from "@utils/types";
import CardPosterImagePlaceholder from "@/app/components/UI/CardPosterImagePlaceholder";
import LoaderCardPoster from "@/app/components/UI/LoaderCardPoster";
import { fetcher } from "@utils/swr/fetcher";

/**
 * CardPoster component
 * @param {string} catalog - media type (movie or tv)
 * @param {string} filteredGenre - filtered genre id
 * @returns {JSX.Element} - JSX element to render
 * @description - This component renders a list of movies or TV shows based on their popularity.
 * It also renders a "Show more" button if the list of movies or TV shows is not empty.
 */
export default function CardPoster({
  catalog,
  filteredGenre,
}: {
  catalog: string;
  filteredGenre: string;
}) {
  const { data, isLoading, isValidating } = useSWR(
    `/api/catalog?mediaType=${catalog}&genre=${filteredGenre}`,
    (url) => fetcher<FetchPosterFromSWR<MediaTypes>>(url),
    { suspense: true },
  );
  const normalized = normalizeData(data.data);

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
          <div className="rounded-xl relative min-w-20 h-35 text-dark bg-secondary">
            {item.poster_path === null ? (
              <div>
                <CardPosterImagePlaceholder />
              </div>
            ) : (
              <Image
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt=""
                width={160}
                height={187}
                className="rounded-t-xl aspect-6/7"
              />
            )}
            <h3 className="m-1">
              {item.normalized !== undefined &&
              item.normalized.normalizeTitle.length > 30
                ? item.normalized?.normalizeTitle.slice(0, 30).concat("...")
                : item.normalized?.normalizeTitle}
            </h3>
          </div>
        </Link>
      </li>
    );
  });

  return <>{cards}</>;
}

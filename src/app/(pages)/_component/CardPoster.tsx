"use client";
import Image from "next/image";
import Link from "next/link";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";
import { MediaTypes } from "@utils/types";
import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import { RatingIcon } from "@utils/tabler-icons";
import { fetcher } from "@utils/swr/fetcher";

const CardPoster = function CardPoster({
  catalog,
  filteredGenre,
  isPending,
}: {
  catalog: string;
  filteredGenre?: string;
  isPending: boolean;
}) {
  const { data, error } = useSWR<MediaTypes>(
    catalog
      ? `/api/catalog?mediaType=${catalog}&genre=${filteredGenre || ""}`
      : null,
    (url) => fetcher(url),
    {
      suspense: true,
    },
  );

  if (!data) return <p>{error}</p>;
  return data.slice(0, 10).map((item) => {
    const title = item.normalized?.normalizeTitle ?? "",
      rating = Number(item.vote_average ?? 0),
      hasRating = rating > 0;

    return (
      <li
        key={item.id}
        className="card-fade-in relative h-35 min-w-20 rounded-xl"
      >
        {isPending ? (
          <LoaderCardPoster />
        ) : (
          <Link
            href={`/preview/${catalog}/${item.id}`}
            aria-label={`View details for ${item.normalized?.normalizeTitle}`}
            className="poster-card focus-ring focus:outline-none"
            prefetch={false}
          >
            {item.poster_path === null ? (
              <div className="poster-placeholder">
                <CardPosterImagePlaceholder />
                <span className="poster-placeholder__label">No Poster</span>
              </div>
            ) : (
              <>
                <Image
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={title ? `Poster for ${title}` : "Poster"}
                  fill
                  decoding="async"
                  placeholder={item.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={item.blurDataUrl}
                  sizes="(max-width: 640px) 45vw, 20vw"
                  className="poster-card__img rounded-xl object-cover"
                />
              </>
            )}
            <span className="poster-card__shimmer" aria-hidden="true" />
            <div className="poster-card__overlay" aria-hidden="true" />
            <div className="poster-card__caption text-foreground-dark bg-secondary/55 group-hover:bg-secondary absolute bottom-0 w-full rounded-b-xl p-1.5 backdrop-blur-sm transition-colors duration-300">
              <h3 className="poster-card__title">{title}</h3>
              <div className="poster-card__meta">
                {hasRating ? (
                  <span className="poster-card__rating">
                    <RatingIcon size={12} aria-hidden="true" />
                    {rating.toFixed(1)}
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        )}
      </li>
    );
  });
};

export default CardPoster;

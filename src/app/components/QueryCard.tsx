import Image from "next/image";
import Link from "next/link";
import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import { Movie, TV } from "@utils/types";
import { RatingIcon } from "@utils/tabler-icons";

export default function QueryCard({
  item,
  catalog,
}: {
  item: Movie | TV;
  catalog: string;
}) {
  return (
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
            alt={
              item.normalized?.normalizeTitle
                ? `Poster for ${item.normalized.normalizeTitle}`
                : "Poster"
            }
            fill
            decoding="async"
            placeholder={item.blurDataUrl ? "blur" : "empty"}
            blurDataURL={item.blurDataUrl}
            sizes="(max-width: 640px) 45vw, 20vw"
            className="poster-card__img absolute rounded-xl object-cover"
          />
        </>
      )}
      <span className="poster-card__shimmer" aria-hidden="true" />
      <div className="poster-card__overlay" aria-hidden="true" />
      <div className="poster-card__caption text-foreground-dark bg-secondary/55 group-hover:bg-secondary absolute bottom-0 w-full rounded-b-xl p-1.5 backdrop-blur-sm transition-colors duration-300">
        <h3 className="poster-card__title">
          {item.normalized?.normalizeTitle}
        </h3>
        <div className="poster-card__meta">
          {item.vote_average ? (
            <span className="poster-card__rating">
              <RatingIcon size={12} aria-hidden="true" />
              {item.vote_average.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

import CardPosterImagePlaceholder from "@/app/components/UI/CardPosterImagePlaceholder";
import UI_Brick from "@/app/components/UI/UI_Brick";
import genreAggregation from "@utils/genreAggregation";
import { Movie, TV, GenreResponseSWR } from "@utils/types";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";

export default function QueryCard({
  item,
  isMovie,
}: {
  item: Movie | TV;
  isMovie: boolean;
}) {
  const mediaType = isMovie ? "movie" : "tv";
  const { data: movie } = useSWR(
    `/api/movie`,
    (url) => fetcher<GenreResponseSWR>(url),
    {
      suspense: true,
    },
  );
  const { data: tv } = useSWR(
    `/api/tv`,
    (url) => fetcher<GenreResponseSWR>(url),
    {
      suspense: true,
    },
  );
  const genres = genreAggregation(movie.data, tv.data);
  const itemGenres = genres
    .filter((genre) => item.genre_ids.includes(genre.id))
    .map((item) => item.name);
  return (
    <Link href={`/preview/${mediaType}/${item.id}`}>
      <div className="flex w-32.5 gap-1 bg-secondary text-dark rounded-xl tablet:w-40">
        {item.poster_path === null ? (
          <div className="w-12.5 h-17.5">
            <CardPosterImagePlaceholder />
          </div>
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
            alt=""
            width={100}
            height={140}
            className="rounded-l-xl  aspect-6/7 object-cover"
          />
        )}
        <div>
          <h2 className="mt-2 text-wrap">
            {item.normalized && item.normalized?.normalizeTitle.length > 25
              ? item.normalized?.normalizeTitle.slice(0, 25).concat("...")
              : item.normalized?.normalizeTitle}
          </h2>
          {itemGenres.length === 1 ? (
            <ul>
              <UI_Brick value={itemGenres} style="text-heading-sm mt-1" />
            </ul>
          ) : itemGenres.length > 1 ? (
            <div className="flex gap-1">
              <ul>
                <UI_Brick value={itemGenres[0]} style="text-heading-sm mt-1" />
              </ul>

              <div className="w-fit border py-0.2 px-1 rounded-xl text-heading-sm mt-1">
                <p>+{itemGenres.length - 1}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

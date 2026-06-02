import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import UI_Brick from "@components/UI/UI_Brick";
import genreAggregation from "@utils/aggregateGenre";
import { Movie, TV, Genres } from "@utils/types";
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
  const { data: movie } = useSWR(`/api/movie`, (url) => fetcher<Genres>(url), {
    suspense: true,
  });
  const { data: tv } = useSWR(`/api/tv`, (url) => fetcher<Genres>(url), {
    suspense: true,
  });
  const genres = genreAggregation(movie.genres, tv.genres);
  const itemGenres = genres
    .filter((genre) => item.genre_ids.includes(genre.id))
    .map((item) => item.name);
  return (
    <Link href={`/preview/${mediaType}/${item.id}`}>
      <div className="group flex flex-col relative gap-1 h-37 bg-secondary text-foreground-dark rounded-xl">
        {item.poster_path === null ? (
          <CardPosterImagePlaceholder />
        ) : (
          <Image
            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="aspect-6/7 object-cover rounded-xl"
          />
        )}
        <div className="px-1 absolute w-full top-auto bottom-0 z-1 backdrop-blur-sm bg-secondary/55 h-15 blur-effect rounded-b-xl group-hover:bg-secondary transition-colors duration-300">
          <h2 className="mt-2 text-wrap line-clamp-2">
            {item.normalized?.normalizeTitle}
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

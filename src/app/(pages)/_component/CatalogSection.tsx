"use client";
import { useState, use, useTransition } from "react";
import CardPoster from "./CardPoster";
import { Response, Genre } from "@utils/types";
import genreAggregation from "@utils/aggregateGenre";
import { checkGenreName } from "@utils/checkGenreName";
interface PropType {
  sectionTitle: string;
  genre: string[];
  movieGenres: Promise<Response<Genre[]>>;
  tvGenres: Promise<Response<Genre[]>>;
}

export default function CatalogSection({
  sectionTitle,
  genre,
  movieGenres,
  tvGenres,
}: PropType) {
  const [catalog, setCatalog] = useState("movie");
  const [isPending, startTransition] = useTransition();

  const movieGenreList = use(movieGenres);
  const tvGenreList = use(tvGenres);

  const fullGenreList = genreAggregation(movieGenreList.data, tvGenreList.data);
  const genreID = fullGenreList
    .filter((item) => checkGenreName(item, genre))
    .map((item) => item.id);
  const filteredGenre = genreID.join("|");
  const handleSwitch = (type: string) => {
    // 3. Wrap state updates in startTransition
    startTransition(() => {
      setCatalog(type);
    });
  };

  return (
    <section
      className="mt-2 tablet:mt-8"
      aria-labelledby={`catalog-${sectionTitle}`}
    >
      <div className="flex flex-col gap-2 pt-2 pl-3 m-w-180 items-center tablet:flex-row desktop-large:pl-0">
        <h2 className="text-heading-lg" id={`catalog-${sectionTitle}`}>
          {sectionTitle}
        </h2>
        <div className="flex" role="tablist" aria-label="Select catalog type">
          <button
            className={`w-13 h-6 py-0 px-2 rounded-l-md font-bold tablet:h-5 ${catalog === "movie" ? "bg-cta text-foreground-light" : "bg-cta-secondary text-foreground-dark"} ${isPending ? "opacity-80" : ""}`}
            onClick={() => handleSwitch("movie")}
            role="tab"
            aria-selected={catalog === "movie"}
            aria-label="List of movies"
          >
            Movie
          </button>
          <button
            className={`w-13 h-6 py-1 px-2 rounded-r-md font-bold tablet:h-5 ${catalog === "tv" ? "bg-cta text-foreground-light" : "bg-cta-secondary text-foreground-dark"} ${isPending ? "opacity-80" : ""}`}
            onClick={() => handleSwitch("tv")}
            role="tab"
            aria-selected={catalog === "tv"}
            aria-label="List of tv shows"
          >
            TV
          </button>
        </div>
      </div>
      <div
        className="w-full max-w-180 place-self-center h-42 p-3 relative overflow-y-hidden overflow-x-auto  scroller"
        role="tabpanel"
      >
        <ul className="flex gap-3 items-center w-full" aria-live="polite">
          <CardPoster
            catalog={catalog}
            filteredGenre={filteredGenre}
            isPending={isPending}
          />
        </ul>
      </div>
    </section>
  );
}

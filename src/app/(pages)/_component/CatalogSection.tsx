"use client";
import CardList from "./CardList";
import useGenres from "@hooks/useGenres";
import { useCatalogState } from "@hooks/useCatalogState";
import { checkGenreName } from "@utils/checkGenreName";
import aggregateGenre from "@utils/aggregateGenre";
import ButtonTabPill from "@components/ButtonTabPill";
interface PropType {
  sectionTitle: string;
  genre: string[];
}

export default function CatalogSection({ sectionTitle, genre }: PropType) {
  const { catalog, setCatalog } = useCatalogState();
  const movieGenreList = useGenres("movie");
  const tvGenreList = useGenres("tv");

  const fullGenreList = aggregateGenre(
    movieGenreList.genres,
    tvGenreList.genres,
  );
  const genreID = fullGenreList
    .filter((item) => checkGenreName(item, genre))
    .map((item) => item.id);
  const filteredGenre = genreID.join("|");
  return (
    <section
      className="tablet:mt-10 desktop-large:max-w-210 desktop:max-w-180 mt-6 w-full place-self-center px-3"
      aria-labelledby={`catalog-${sectionTitle}`}
    >
      <div className="tablet:flex-row tablet:items-end tablet:justify-between flex flex-col items-start gap-3">
        <h2
          id={`catalog-${sectionTitle}`}
          className="text-heading-lg section-title"
        >
          {sectionTitle}
        </h2>
        <ButtonTabPill
          options={[
            { value: "movie", label: "Movie", ariaLabel: "List of movies" },
            { value: "tv", label: "TV", ariaLabel: "List of tv shows" },
          ]}
          value={catalog}
          onChange={setCatalog}

          ariaLabel="Select catalog type"
        />
      </div>
      <div
        className="scroller catalog-row-rail desktop:max-w-180 desktop-large:max-w-210 relative mt-4 h-42 w-full place-self-center overflow-x-auto overflow-y-hidden py-3"
        role="tabpanel"
      >
        <ul className="flex w-full items-stretch gap-4 pr-4" aria-live="polite">
          <CardList catalog={catalog} filteredGenre={filteredGenre} />
        </ul>
      </div>
    </section>
  );
}

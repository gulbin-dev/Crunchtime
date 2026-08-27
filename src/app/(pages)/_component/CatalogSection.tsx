"use client";
import { useEffect, useRef, useState, useTransition, Suspense } from "react";
import CardPoster from "./CardPoster";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import useGenres from "@hooks/useGenres";
import { checkGenreName } from "@utils/checkGenreName";
import aggregateGenre from "@utils/aggregateGenre";
interface PropType {
  sectionTitle: string;
  genre: string[];
}

export default function CatalogSection({ sectionTitle, genre }: PropType) {
  const movieGenreList = useGenres("movie"),
    tvGenreList = useGenres("tv"),
    pillRef = useRef<HTMLDivElement | null>(null),
    movieBtnRef = useRef<HTMLButtonElement | null>(null),
    tvBtnRef = useRef<HTMLButtonElement | null>(null),
    [catalog, setCatalog] = useState("movie"),
    [isPending, startTransition] = useTransition(),
    [indicator, setIndicator] = useState<{ left: number; width: number }>({
      left: 4,
      width: 0,
    });

  const fullGenreList = aggregateGenre(
    movieGenreList.genres,
    tvGenreList.genres,
  );

  const genreID = fullGenreList
    .filter((item) => checkGenreName(item, genre))
    .map((item) => item.id);
  const filteredGenre = genreID.join("|");

  const updateIndicatorGeometry = (type: string) => {
    const activeBtn = type === "movie" ? movieBtnRef.current : tvBtnRef.current;
    if (!activeBtn || !pillRef.current) return;

    const pillRect = pillRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    setIndicator({
      left: btnRect.left - pillRect.left,
      width: btnRect.width,
    });
  };

  const handleSwitch = (type: string) => {
    if (type === catalog) return;

    updateIndicatorGeometry(type);
    startTransition(() => {
      setCatalog(type);
    });
  };

  // Measures initial dimensions once on mount
  useEffect(() => {
    updateIndicatorGeometry(catalog);

    // Recalculate on screen resize to handle responsive layouts
    window.addEventListener("resize", () => updateIndicatorGeometry(catalog));
    return () =>
      window.removeEventListener("resize", () =>
        updateIndicatorGeometry(catalog),
      );
  }, []);

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
        <div
          className="tab-pill relative self-start"
          role="tablist"
          aria-label="Select catalog type"
          ref={pillRef}
        >
          <span
            className="tab-pill__indicator absolute transition-all duration-300 ease-out"
            aria-hidden="true"
            style={{ left: indicator.left, width: indicator.width }}
          />
          <button
            ref={movieBtnRef}
            type="button"
            role="tab"
            aria-selected={catalog === "movie"}
            aria-label="List of movies"
            className="tab-pill__btn relative z-10"
            onClick={() => handleSwitch("movie")}
          >
            Movie
          </button>
          <button
            ref={tvBtnRef}
            type="button"
            role="tab"
            aria-selected={catalog === "tv"}
            aria-label="List of tv shows"
            className={`tab-pill__btn relative z-10`}
            onClick={() => handleSwitch("tv")}
          >
            TV
          </button>
        </div>
      </div>
      <div
        className="scroller catalog-row-rail desktop:max-w-180 desktop-large:max-w-210 relative mt-4 h-42 w-full place-self-center overflow-x-auto overflow-y-hidden py-3"
        role="tabpanel"
      >
        <ul className="flex w-full items-stretch gap-4 pr-4" aria-live="polite">
          <Suspense
            fallback={Array.from({ length: 10 }, (_, index) => (
              <li key={index}>
                <LoaderCardPoster />
              </li>
            ))}
          >
            <CardPoster
              catalog={catalog}
              filteredGenre={filteredGenre}
              isPending={isPending}
            />
          </Suspense>
        </ul>
      </div>
    </section>
  );
}

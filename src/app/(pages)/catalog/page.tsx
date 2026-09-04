"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  IconAdjustmentsHorizontal,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import PageWrapper from "../PageWrapper";
import QueryCard from "@components/QueryCard";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import ButtonTabPill from "@components/ButtonTabPill";
import useGenres from "@hooks/useGenres";
import { useCatalogState } from "@hooks/useCatalogState";
import { fetcher } from "@utils/swr/fetcher";
import { Genre, MediaTypes } from "@utils/types";

type SortOption = "popularity" | "rating" | "title" | "recent";

function sortMedia(items: MediaTypes, sortBy: SortOption) {
  return [...items].sort((first, second) => {
    if (sortBy === "title") {
      return first.normalized.normalizeTitle.localeCompare(
        second.normalized.normalizeTitle,
      );
    }

    if (sortBy === "recent") {
      const firstDate =
        "release_date" in first ? first.release_date : first.first_air_date;
      const secondDate =
        "release_date" in second ? second.release_date : second.first_air_date;
      return secondDate.localeCompare(firstDate);
    }

    return sortBy === "rating"
      ? second.vote_average - first.vote_average
      : second.popularity - first.popularity;
  });
}

export default function Catalog() {
  const { catalog, setCatalog } = useCatalogState();
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const { genres: genreData } = useGenres(catalog as "movie" | "tv");

  // Build API URL with comma-separated genre filters if selected
  const genreParams =
    selectedGenres.length > 0 ? `&genres=${selectedGenres.join(",")}` : "";
  const apiUrl = `/api/catalog?mediaType=${catalog}${genreParams}`;

  const { data, error, isLoading } = useSWR<MediaTypes>(apiUrl, fetcher);

  const genres = genreData?.genres ?? [];
  const searchTerm = query.trim().toLowerCase();

  // Handle multiple genre selection
  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId],
    );
  };

  const media = sortMedia(
    (data ?? []).filter(
      (item) =>
        (selectedGenres.length === 0 ||
          selectedGenres.some((id) => item.genre_ids.includes(Number(id)))) &&
        item.normalized.normalizeTitle.toLowerCase().includes(searchTerm),
    ),
    sortBy,
  );

  return (
    <PageWrapper>
      <section
        className="tablet:px-8 tablet:py-12 mx-auto max-w-7xl px-3 py-8"
        aria-labelledby="catalog-title"
      >
        <div className="tablet:flex-row tablet:items-end tablet:justify-between mb-8 flex flex-col gap-5">
          <div>
            <p className="text-secondary mb-2 text-sm font-bold tracking-[0.18em] uppercase">
              Browse the collection
            </p>
            <h1 className="text-heading-xl" id="catalog-title">
              Find something worth watching.
            </h1>
            <p className="text-dark-shade mt-2 max-w-xl text-sm dark:text-gray-300">
              Browse popular movies and TV shows, then narrow the list to fit
              your mood.
            </p>
          </div>
        </div>

        <div className="tablet:grid-cols-[1fr_0.5fr_0.4fr_auto] grid gap-3">
          <label className="relative block">
            <span className="sr-only">Search catalog</span>
            <IconSearch
              className="text-dark-shade absolute top-1/2 left-3 -translate-y-1/2"
              size={18}
              aria-hidden="true"
            />
            <input
              className="border-gray-shade/50 focus:border-cta focus:ring-cta/20 w-full rounded-lg border bg-white py-2 pr-10 pl-10 text-sm text-black transition outline-none focus:ring-4"
              type="search"
              value={query}
              placeholder="Search by title..."
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button
                className="text-dark-shade hover:text-foreground-dark absolute top-1/2 right-3 -translate-y-1/2"
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <IconX size={18} aria-hidden="true" />
              </button>
            ) : null}
          </label>

          <label className="relative flex items-center">
            <span className="sr-only">Filter by genre</span>
            <IconAdjustmentsHorizontal
              className="text-dark-shade pointer-events-none absolute left-3 z-1"
              size={18}
              aria-hidden="true"
            />
            <div className="border-gray-shade/50 focus-within:border-cta relative flex h-full w-full rounded-lg border bg-white py-1.5">
              <button
                type="button"
                className="text-dark-shade mx-auto text-sm underline hover:no-underline"
                onClick={(e) => {
                  e.currentTarget.nextElementSibling?.classList.toggle(
                    "hidden",
                  );
                }}
              >
                {genres.length === 0 ? (
                  <span className="text-dark-shade text-sm">
                    Loading genres...
                  </span>
                ) : selectedGenres.length === 0 ? (
                  <span className="text-dark-shade text-sm">
                    Select genres...
                  </span>
                ) : (
                  <>
                    {" "}
                    <span className="text-dark-shade text-sm">
                      Select genres...
                    </span>
                    <span className="bg-dark-shade dark:bg-primary-shade rounded-full p-1.5">
                      {selectedGenres.length}
                    </span>
                  </>
                )}
              </button>
              <div className="border-gray-shade/50 absolute top-full left-0 z-10 hidden rounded-lg border bg-white p-3 shadow-lg">
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {genres.map((genre: Genre) => (
                    <label
                      key={genre.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(String(genre.id))}
                        onChange={() => handleGenreToggle(String(genre.id))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-black">{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </label>

          <label>
            <span className="sr-only">Sort catalog</span>
            <select
              className="border-gray-shade/50 focus:border-cta w-full rounded-lg border bg-white px-3 py-2 text-sm text-black outline-none"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
            >
              <option value="popularity">Most popular</option>
              <option value="rating">Top rated</option>
              <option value="recent">Recently released</option>
              <option value="title">Title A-Z</option>
            </select>
          </label>
          <ButtonTabPill
            options={[
              { value: "movie", label: "Movie", ariaLabel: "List of movies" },
              { value: "tv", label: "TV", ariaLabel: "List of tv shows" },
            ]}
            value={catalog}
            onChange={(value) => setCatalog(value)}
            ariaLabel="Select catalog type"
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-heading-md">
            {catalog === "movie" ? "Movies" : "TV Shows"}
          </h2>
          <p className="text-dark-shade text-sm dark:text-gray-300">
            {isLoading ? "Loading..." : `${media.length} titles`}
          </p>
        </div>

        {error ? (
          <p className="text-dark-shade py-16 text-center">
            We could not load the catalog right now. Please try again later.
          </p>
        ) : isLoading ? (
          <ul className="tablet:grid-cols-4 desktop:grid-cols-6 mt-4 grid grid-cols-2 gap-4">
            {Array.from({ length: 12 }, (_, index) => (
              <li key={index}>
                <LoaderCardPoster />
              </li>
            ))}
          </ul>
        ) : media.length ? (
          <ul className="tablet:grid-cols-4 desktop:grid-cols-6 mt-4 grid grid-cols-2 gap-4">
            {media.map((item) => (
              <li className="min-w-0" key={item.id}>
                <QueryCard item={item} catalog={catalog} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-dark-shade py-16 text-center">
            No titles match those filters. Try a different search.
          </p>
        )}
      </section>
    </PageWrapper>
  );
}

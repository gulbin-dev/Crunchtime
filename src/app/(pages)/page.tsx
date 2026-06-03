import FiveTrend from "./_component/FiveTrend";
import { Suspense } from "react";
import FiveTrendLoader from "@components/UI/FiveTrendLoader";
import PageLoader from "@components/UI/PageLoader";
import SearchUI from "@components/SearchUI";
import PageWrapper from "./PageWrapper";
import { popularList } from "@server/popularList";
import { movieGenreList } from "@server/movieGenres";
import { tvGenreList } from "@server/tvGenres";
import CatalogSection from "./_component/CatalogSection";
import Button from "@components/UI/Button";

export default async function Home() {
  const trending = popularList();
  const movieGenres = movieGenreList();
  const tvGenres = tvGenreList();

  return (
    <PageWrapper>
      <div className="max-w-180 place-self-center relative w-full">
        <div className="relative z-20">
          <h1
            className="text-pretty text-heading-lg font-bold pt-2 px-3
          tablet:pt-5 tablet:ml-10  tablet:text-heading-lg tablet:text-start 
          "
          >
            Discover worth to watch movies & TV shows
          </h1>
        </div>
        <SearchUI />
        <section
          className="relative w-full h-96 overflow-hidden px-3"
          aria-labelledby="popular-five"
        >
          <h2
            className="relative w-fit z-20 top-15 text-foreground-light text-heading-lg tablet:top-25 tablet:left-10"
            id="popular-five"
          >
            Top 5 Most Popular
          </h2>

          <Suspense fallback={<FiveTrendLoader />}>
            <FiveTrend
              trending={trending}
              movieGenres={movieGenres}
              tvGenres={tvGenres}
            />
          </Suspense>
        </section>
        <Suspense fallback={<PageLoader />}>
          <CatalogSection
            sectionTitle="Trending"
            genre={[""]}
            movieGenres={movieGenres}
            tvGenres={tvGenres}
          />
          <CatalogSection
            sectionTitle="Action"
            genre={["Action"]}
            movieGenres={movieGenres}
            tvGenres={tvGenres}
          />
          <CatalogSection
            sectionTitle="Animation"
            genre={["Animation"]}
            movieGenres={movieGenres}
            tvGenres={tvGenres}
          />
          <CatalogSection
            sectionTitle="Drama"
            genre={["Drama"]}
            movieGenres={movieGenres}
            tvGenres={tvGenres}
          />
        </Suspense>
        <section className="flex flex-col" aria-labelledby="discover-more">
          <Button className="rounded-xl p-3 text-nowrap bg-cta font-bold w-fit h-fit place-self-center mt-4">
            DISCOVER MORE
          </Button>
          <div
            className={`flex flex-col mt-5 px-3 py-10 gap-2 tablet:flex-row tablet:justify-center tablet:gap-20 `}
          >
            <div>
              <h3 className="text-heading-lg">Watch Anytime, Anywhere</h3>
              <p className="mt-1">
                Watch on smart TVs, gaming consoles, mobile devices and
                computers
              </p>
            </div>

            <div>
              <h3 className="text-heading-lg">Watch it later</h3>
              <p className="mt-1">
                Download your favorite movies and TV shows offline
              </p>
            </div>
          </div>

          <div className="flex flex-col rounded-lg place-self-center my-5 p-2 bg-secondary">
            <h3 className=" text-heading-lg">JOIN US NOW</h3>
            <Button className="py-1 mt-1 px-3 w-fit font-bold place-self-center">
              SIGN UP
            </Button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

import FiveTrend from "./_component/FiveTrend";
import { Suspense } from "react";
import FiveTrendLoader from "@components/UI/FiveTrendLoader";
import PageLoader from "@components/UI/PageLoader";
import SearchUI from "@components/SearchUI";
import PageWrapper from "./PageWrapper";
import CatalogSection from "./_component/CatalogSection";
import Button from "@components/UI/Button";
export default async function Home() {
  return (
    <PageWrapper>
      <h1 className="text-heading-lg tablet:pt-5 tablet:ml-10 text-foreground-primary desktop:absolute tablet:text-heading-lg tablet:text-start desktop:text-white pointer-events-none relative z-20 px-3 pt-2 font-bold text-pretty">
        Discover worth to watch movies & TV shows
      </h1>
      <SearchUI
        className="desktop:hidden block"
        inputId="search-on-small-screen"
      />
      <section
        className="relative h-96 w-full overflow-hidden px-3"
        aria-labelledby="popular-five"
      >
        <h2
          className="text-foreground-light text-heading-lg tablet:top-25 tablet:left-10 pointer-events-none relative top-15 z-20 w-fit"
          id="popular-five"
        >
          Top 5 Most Popular
        </h2>

        <Suspense fallback={<FiveTrendLoader />}>
          <FiveTrend />
        </Suspense>
      </section>
      <Suspense fallback={<PageLoader />}>
        <CatalogSection sectionTitle="Trending" genre={[""]} />
        <CatalogSection sectionTitle="Action" genre={["Action"]} />
        <CatalogSection sectionTitle="Animation" genre={["Animation"]} />
        <CatalogSection sectionTitle="Drama" genre={["Drama"]} />
      </Suspense>
      <section className="flex flex-col" aria-labelledby="discover-more">
        <Button className="mt-4 h-fit w-fit place-self-center rounded-xl p-3 font-bold text-nowrap">
          DISCOVER MORE
        </Button>
        <div
          className={`tablet:flex-row tablet:justify-center tablet:gap-20 mt-5 flex flex-col gap-2 px-3 py-10`}
        >
          <div>
            <h3 className="text-heading-lg">Watch Anytime, Anywhere</h3>
            <p className="">
              Watch on smart TVs, gaming consoles, mobile devices and computers
            </p>
          </div>

          <div>
            <h3 className="text-heading-lg">Watch it later</h3>
            <p className="mt-1">
              Download your favorite movies and TV shows offline
            </p>
          </div>
        </div>

        <div className="bg-secondary my-5 flex flex-col place-self-center rounded-lg p-2">
          <h3 className="text-heading-lg">JOIN US NOW</h3>
          <Button className="mt-1 w-fit place-self-center px-3 py-1 font-bold">
            SIGN UP
          </Button>
        </div>
      </section>
    </PageWrapper>
  );
}

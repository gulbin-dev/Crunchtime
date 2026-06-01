import Link from "next/link";
import FiveTrend from "./_component/FiveTrend";
import CatalogSection from "./_component/CatalogSection";
import { Suspense } from "react";
import FiveTrendLoader from "@/app/components/UI/FiveTrendLoader";
import PageLoader from "@/app/components/UI/PageLoader";
import SearchUI from "@components/SearchUI";
import PageWrapper from "./PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div className="max-w-180 place-self-center relative w-full bg-primary text-foreground-primary transition-colors duration-300">
        <div className="relative z-20 mb-5">
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
          className="relative text-light w-full h-screen overflow-hidden bg-dark-50 px-3"
          aria-labelledby="popular-five"
        >
          <h2
            className="relative z-20 top-25  text-heading-md tablet:top-[45vh] tablet:left-10"
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
          <Link
            href="/"
            className="rounded-xl p-3 text-nowrap text-light bg-cta font-bold w-fit h-fit place-self-center mt-4"
            id="discover-more"
          >
            DISCOVER MORE
          </Link>
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

          <div className="flex flex-col rounded-lg text-dark place-self-center my-5 p-2 bg-secondary">
            <h3 className=" text-heading-lg">JOIN US NOW</h3>
            <button className="bg-cta py-1 mt-1 px-3 w-fit text-light font-bold place-self-center rounded-md">
              SIGN UP
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

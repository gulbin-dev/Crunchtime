import FiveTrend from "./_component/FiveTrend";
import { Suspense } from "react";
import FiveTrendLoader from "@components/UI/FiveTrendLoader";
import SearchUI from "@components/SearchUI";
import PageWrapper from "./PageWrapper";
import CatalogSection from "./_component/CatalogSection";
import Button from "@components/UI/Button";
import Link from "next/link";
import {
  IconBookmark,
  IconCheck,
  IconCompass,
  IconAdjustmentsHorizontal,
  IconHistory,
  IconMessageCircle,
  IconStar,
} from "@tabler/icons-react";
import FeatureFlagWrapper from "../components/FeatureFlag";

const features = [
  {
    icon: IconCompass,
    number: "01",
    title: "Find your next favorite",
    description:
      "Explore popular picks and genre collections made for your kind of night.",
  },
  {
    icon: IconBookmark,
    number: "02",
    title: "Build a watchlist",
    description:
      "Save the movies and shows that catch your eye before they disappear from memory.",
  },
  {
    icon: IconStar,
    number: "03",
    title: "Rate what you watch",
    description:
      "Keep your own taste profile growing with quick ratings for every watch.",
  },
  {
    icon: IconMessageCircle,
    number: "04",
    title: "Share the verdict",
    description:
      "Leave a review and help other movie fans decide what deserves their time.",
  },
  {
    icon: IconAdjustmentsHorizontal,
    number: "05",
    title: "Filter by your mood",
    description:
      "Jump straight to the genres and themes that match the kind of night you have in mind.",
  },
  {
    icon: IconHistory,
    number: "06",
    title: "Keep your movie history",
    description:
      "Look back on what you have seen and find patterns in your personal taste.",
  },
];

export default function Home() {
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

      <CatalogSection sectionTitle="Trending" genre={[""]} />
      <CatalogSection sectionTitle="Action" genre={["Action"]} />
      <CatalogSection sectionTitle="Animation" genre={["Animation"]} />
      <CatalogSection sectionTitle="Drama" genre={["Drama"]} />

      <div className="mt-4 flex justify-center">
        <Link
          href="/catalog"
          className="bg-cta hover:bg-cta-secondary h-fit w-fit rounded-xl p-3 font-bold text-nowrap"
        >
          DISCOVER MORE
        </Link>
      </div>
      <section
        className="bg-foreground-primary dark:bg-dark-shade text-foreground-light tablet:px-10 mt-12 px-3 py-12"
        aria-labelledby="discover-more"
      >
        <div className="mx-auto max-w-6xl">
          <div className="tablet:flex-row tablet:items-end tablet:justify-between mb-10 flex flex-col gap-4">
            <div className="max-w-xl">
              <p className="text-secondary mb-2 text-sm font-bold tracking-[0.18em] uppercase">
                Your movie corner
              </p>
              <h2 className="text-heading-xl" id="discover-more">
                Make every watch count.
              </h2>
            </div>
            <p className="text-primary-shade tablet:text-right max-w-md text-sm">
              One place to discover, remember, and talk about the stories that
              stay with you.
            </p>
          </div>

          <div className="tablet:grid-cols-2 desktop:grid-cols-3 grid gap-px overflow-hidden rounded-lg bg-gray-500/40">
            {features.map(({ icon: Icon, number, title, description }) => (
              <article
                className="group bg-surface-elevated text-foreground-light before:bg-secondary relative isolate flex min-h-50 flex-col overflow-hidden p-5 transition-colors duration-300 ease-in-out before:pointer-events-none before:absolute before:inset-x-0 before:bottom-0 before:z-0 before:h-full before:translate-y-full before:transition-transform before:duration-500 before:ease-in-out before:content-[''] group-hover:before:translate-y-0 hover:before:translate-y-0"
                key={number}
              >
                <div className="relative z-10 mb-10 flex items-start justify-between">
                  <Icon
                    className="text-cta group-hover:text-foreground-dark transition-colors duration-300"
                    size={28}
                    stroke={1.5}
                  />
                  <span className="text-primary-shade group-hover:text-foreground-dark text-sm font-bold transition-colors duration-300">
                    {number}
                  </span>
                </div>
                <h3 className="text-heading-md relative z-10 mb-2">{title}</h3>
                <p className="text-primary-shade group-hover:text-foreground-dark relative z-10 text-sm leading-4 transition-colors duration-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <FeatureFlagWrapper featureFlag="ACCOUNT_FLAG">
            <div className="tablet:flex-row tablet:items-center tablet:justify-between mt-10 flex flex-col gap-5 border-t border-gray-500/50 pt-6">
              <div className="flex items-center gap-2">
                <IconCheck className="text-secondary" size={20} stroke={2.5} />
                <p className="text-sm">Your next great watch starts here.</p>
              </div>
              <Button className="w-fit px-5 py-3 font-bold">
                START YOUR LIST
              </Button>
            </div>
          </FeatureFlagWrapper>
        </div>
      </section>
    </PageWrapper>
  );
}

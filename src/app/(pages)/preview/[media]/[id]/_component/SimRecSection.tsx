"use client";
import { Suspense } from "react";
import { Similar, Recommendation } from "./DataDependentComponents";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import Button from "@components/UI/Button";

type ClientSimRecSectionProps = {
  isSimilar: boolean;
  isVisible: boolean;
  snapUpdate: boolean; // set true if its Similar button is clicked, false otherwise
  isPending: boolean;
  handleDesktopViewSwitch: (showSimilar: boolean) => void;
};

export default function SimRecSection({
  isSimilar,
  isVisible,
  snapUpdate,
  isPending,
  handleDesktopViewSwitch,
}: ClientSimRecSectionProps) {
  const handleRecommendationSwitch = (showSimilar: boolean) => {
    if (showSimilar === isSimilar) return;
    handleDesktopViewSwitch(showSimilar);
  };
  return (
    <section
      className={`${isVisible ? "block" : "hidden"} desktop:block desktop:col-start-8 desktop:col-end-13 desktop:row-start-2 col-span-full row-start-5 mt-8 px-3`}
    >
      <ul className="desktop:flex hidden gap-2 pb-2">
        <li>
          <Button
            config={{ type: snapUpdate ? "tab-primary" : "secondary" }}
            onClick={() => handleRecommendationSwitch(true)}
            disabled={isPending}
            aria-pressed={snapUpdate}
          >
            Similar
          </Button>
        </li>
        <li>
          <Button
            config={{ type: snapUpdate ? "secondary" : "tab-primary" }}
            onClick={() => handleRecommendationSwitch(false)}
            disabled={isPending}
            aria-pressed={!snapUpdate}
          >
            Recommendations
          </Button>
        </li>
      </ul>
      <ul className="grid auto-rows-auto grid-cols-[repeat(auto-fit,minmax(150px,1fr))] justify-center gap-1.5 overflow-hidden transition-opacity duration-200 aria-busy:opacity-60">
        {isPending ? (
          Array.from({ length: 5 }, (_, index) => (
            <li key={index}>
              <LoaderCardPoster />
            </li>
          ))
        ) : (
          <Suspense
            fallback={Array.from({ length: 5 }, (_, index) => (
              <li key={index}>
                <LoaderCardPoster />
              </li>
            ))}
          >
            {isSimilar ? <Similar /> : <Recommendation />}
          </Suspense>
        )}
      </ul>
    </section>
  );
}

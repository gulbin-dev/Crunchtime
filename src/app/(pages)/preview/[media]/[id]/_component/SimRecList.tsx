import { Suspense, useRef } from "react";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import { SimilarCards, RecommendationCards } from "./DataDependentComponents";

export function Similar() {
  const panelRef = useRef<HTMLUListElement | null>(null);
  return (
    <ul
      className="panel--section__toggle desktop:col-start-8 desktop:col-end-13 desktop:row-start-4 col-start-1 row-start-2 grid auto-rows-max grid-cols-[repeat(auto-fit,minmax(150px,1fr))] justify-center justify-items-center gap-1.5 overflow-hidden transition-opacity duration-200 aria-busy:opacity-60"
      data-view="similar"
    >
      <Suspense
        fallback={Array.from({ length: 5 }, (_, index) => (
          <li key={index}>
            <LoaderCardPoster />
          </li>
        ))}
      >
        <SimilarCards panelRef={panelRef} />
      </Suspense>
    </ul>
  );
}

export function Recommendation() {
  const panelRef = useRef<HTMLUListElement | null>(null);
  return (
    <ul
      className="panel--section__toggle desktop:col-start-8 desktop:col-end-13 desktop:row-start-4 col-start-1 row-start-2 grid min-h-60 grid-flow-row auto-rows-max grid-cols-[repeat(auto-fit,minmax(150px,1fr))] justify-center justify-items-center gap-1.5 overflow-hidden transition-opacity duration-200 aria-busy:opacity-60"
      data-view="recommended"
    >
      <Suspense
        fallback={Array.from({ length: 5 }, (_, index) => (
          <li key={index}>
            <LoaderCardPoster />
          </li>
        ))}
      >
        <RecommendationCards panelRef={panelRef} />
      </Suspense>
    </ul>
  );
}

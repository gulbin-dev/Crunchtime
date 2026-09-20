"use client";

import { Suspense, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Cast, Crew, Overview } from "./DataDependentComponents";
import MediaBanner from "@components/MediaBanner";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import Button from "@components/UI/Button";
import { gsap, useGSAP, mediaQueries } from "@utils/gsap";

export default function ClientDetailsSection() {
  const [snapIsToggled, setSnapIsToggled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const castListRef = useRef<HTMLUListElement | null>(null);
  const crewListRef = useRef<HTMLUListElement | null>(null);
  const tween = useRef<gsap.core.Timeline | null>(null);

  // handle expansion and contraction animation on toggle
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mediaQueries, (context) => {
        const { isDesktop } = context.conditions ?? {};
        if (!isDesktop) {
          // Initialize the CSS Variable custom property values
          gsap.set(".details__grid-wrapper", { "--accordion-rows": "0fr" });

          tween.current = gsap
            .timeline({
              onComplete: () => {
                setSnapIsToggled(true);
              },
              onReverseComplete: () => {
                setSnapIsToggled(false);
              },
            })
            .to(".details__grid-wrapper", {
              "--accordion-rows": "1fr",
              pointerEvents: "auto",
              duration: 0.5,
              ease: "power2.out",
            })
            .to(
              ".action--div__toggle",
              {
                keyframes: {
                  "0%": { autoAlpha: 1 },
                  "10": { autoAlpha: 0 },
                  "90": { autoAlpha: 0 },
                  "100": { autoAlpha: 1 },
                },
                duration: 0.5,
              },
              "<",
            )
            .paused(true);
        } else {
          // Reset custom property on desktop layout modes
          gsap.set(".details__grid-wrapper", {
            clearProps: "--accordion-rows",
          });
        }
      });
    },
    { scope: containerRef },
  );

  const handleToggle = () => {
    if (!snapIsToggled) {
      tween.current?.play();
    } else {
      tween.current?.reverse();
    }
  };

  return (
    <>
      {/* Container holding standard details card layouts */}
      <div
        ref={containerRef}
        className="tablet:rounded-lg desktop:border bg-secondary/20 border-secondary/60 desktop:rounded-4xl tablet:shadow-2xl tablet:backdrop-blur-xl desktop:min-h-125.5 desktop:max-h-fit desktop:pb-4 desktop:col-start-8 desktop:col-end-13 desktop:row-start-1 desktop:row-span-5 relative row-start-2 p-4 pb-12 shadow-lg backdrop-blur-lg"
      >
        {/* Persistent top elements always visible */}
        <Suspense
          fallback={
            <div className="h-14 w-10 rounded-lg">
              <CardPosterImagePlaceholder />
            </div>
          }
        >
          <MediaBanner />
        </Suspense>

        <h2 className="text-heading-xl text-secondary mt-5 font-semibold">
          Overview
        </h2>
        <Suspense fallback={<Skeleton count={4} width="80%" height={16} />}>
          <Overview />
        </Suspense>

        {/* 🚀 PERFORMANT WORKAROUND INNER GRID SYSTEM */}
        <div
          className="details__grid-wrapper pointer-events-none grid overflow-hidden transition-all duration-75"
          style={{
            gridTemplateRows: "var(--accordion-rows, 1fr)",
            pointerEvents: "none",
          }}
        >
          {/* Inner DOM block containing expandable heavy content */}
          <div className="min-h-0">
            <h3 className="text-heading-lg pt-5">Casts</h3>
            <ul
              ref={castListRef}
              className="flex w-full gap-2 overflow-x-auto overflow-y-hidden scroll-smooth"
            >
              <Suspense
                fallback={Array.from({ length: 3 }, (_, i) => (
                  <li key={i}>
                    <LoaderCardPoster />
                  </li>
                ))}
              >
                <Cast listRef={castListRef} />
              </Suspense>
            </ul>

            <h3 className="text-heading-lg pt-5">Crew</h3>
            <ul
              ref={crewListRef}
              className="flex w-full gap-2 overflow-x-auto overflow-y-hidden scroll-smooth"
            >
              <Suspense
                fallback={Array.from({ length: 3 }, (_, i) => (
                  <li key={i}>
                    <LoaderCardPoster />
                  </li>
                ))}
              >
                <Crew listRef={crewListRef} />
              </Suspense>
            </ul>
          </div>
        </div>

        {/* Action Toggle Layer */}
        <div className="action--div__toggle to-secondary dark:to-secondary-darker desktop:hidden absolute inset-x-0 bottom-0 left-0 flex justify-center overflow-hidden bg-linear-to-b from-transparent pt-7 pb-3 transition-all duration-300">
          <Button onClick={handleToggle} config={{ type: "primary" }}>
            {snapIsToggled ? "Show less" : "Show more"}
          </Button>
        </div>
      </div>
    </>
  );
}

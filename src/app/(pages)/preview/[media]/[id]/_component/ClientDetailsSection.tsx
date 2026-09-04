"use client";

import { Suspense, useState, useRef, useTransition } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Cast, Crew, Overview } from "./DataDependentComponents";
import MediaBanner from "@components/MediaBanner";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import Button from "@components/UI/Button";
import { gsap, useGSAP, mediaQueries } from "@utils/gsap";

/**
 * User interactive component on Preview page
 */
export default function ClientDetailsSection() {
  const [transitionToggleShowMore, setTransitionToggleShowMore] =
    useState(false); // setting toggle state after animation
  const [snapIsToggled, setSnapIsToggled] = useState(false); // setting toggle state after button click
  const sectionRef = useRef<HTMLElement | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null); // tracking gsap animation between render
  const [isPending, startTransition] = useTransition(); // handle smooth transition between toggles
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(mediaQueries, (context) => {
        const { isDesktop } = context.conditions ?? {};
        if (!isDesktop) {
          tween.current = gsap
            .to(
              ".details__container",

              {
                maxHeight: "1500px",
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                  const stateValue = !transitionToggleShowMore;

                  startTransition(() =>
                    setTransitionToggleShowMore((prev) => !prev),
                  );
                  setSnapIsToggled(stateValue);
                },
                onReverseComplete: () => {
                  const stateValue = transitionToggleShowMore;
                  startTransition(() =>
                    setTransitionToggleShowMore((prev) => !prev),
                  );
                  setSnapIsToggled(stateValue);
                },
              },
            )
            .paused(true);
        }
      });
    },
    { scope: sectionRef },
  );

  const handleToggle = () => {
    const stateValue = !transitionToggleShowMore;
    if (stateValue) {
      tween.current?.play();
    } else {
      tween.current?.reverse();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="desktop:col-start-8 desktop:col-end-13 desktop:row-start-1 desktop:row-span-5 row-start-2"
    >
      <div className="details__container tablet:rounded-lg desktop:border bg-secondary/20 border-secondary/60 desktop:rounded-4xl tablet:shadow-2xl tablet:backdrop-blur-xl desktop:max-h-fit desktop:pb-4 relative max-h-50 overflow-hidden p-4 pb-12 shadow-lg backdrop-blur-lg">
        <Suspense
          fallback={
            <div className="relative grid grid-cols-[max-content_1fr] grid-rows-[auto_auto] gap-x-2">
              <div className="col-start-1 row-span-full aspect-9/16 h-14 w-10 rounded-lg">
                <CardPosterImagePlaceholder />
              </div>
              <div className="col-start-2 col-end-3 row-start-1 flex flex-col gap-1">
                <Skeleton width="40%" height={20} />
                <div className="flex gap-1">
                  <Skeleton width={38} height={16} />
                  <Skeleton width={56} height={16} />
                </div>
                <ul className="col-start-2 row-start-2 mt-1 flex flex-wrap gap-1">
                  {Array.from({ length: 3 }, (_, index) => (
                    <li key={index}>
                      <Skeleton width={48} height={16} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          }
        >
          <MediaBanner />
        </Suspense>
        <h2 className="text-heading-xl text-secondary mt-5 font-semibold">
          Overview
        </h2>
        <Suspense
          fallback={
            <div className="flex flex-col">
              <Skeleton count={3} width="80%" height={16} />
              <Skeleton width="30%" height={16} />
            </div>
          }
        >
          <Overview />
        </Suspense>

        <h3 className="text-heading-lg pt-5">Casts</h3>
        <ul className="flex w-full gap-2 overflow-x-auto overflow-y-hidden">
          <Suspense
            fallback={Array.from({ length: 3 }, (_, index) => (
              <li key={index}>
                <LoaderCardPoster />
              </li>
            ))}
          >
            <Cast />
          </Suspense>
        </ul>

        <h3 className="text-heading-lg pt-5">Crew</h3>
        <ul className="flex w-full gap-2 overflow-x-auto overflow-y-hidden">
          <Suspense
            fallback={Array.from({ length: 3 }, (_, index) => (
              <li key={index}>
                <LoaderCardPoster />
              </li>
            ))}
          >
            <Crew />
          </Suspense>
        </ul>
        <div
          className={`absolute inset-x-0 flex transition-all duration-300 ${snapIsToggled ? "bottom-2 left-3" : "to-secondary dark:to-secondary-darker desktop:hidden bottom-0 left-0 block justify-center overflow-hidden bg-linear-to-b from-transparent pt-7 pb-3"} ${isPending ? "invisible" : "visible"}`}
        >
          <Button onClick={handleToggle} config={{ type: "primary" }}>
            {snapIsToggled ? "Show less" : "Show more"}
          </Button>
        </div>
      </div>
    </section>
  );
}

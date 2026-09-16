"use client";

import { useState, useRef } from "react";
import { Similar, Recommendation } from "./SimRecList";
import ReviewSection from "./ReviewSection";
import Button from "@components/UI/Button";
import { gsap, useGSAP, mediaQueries } from "@utils/gsap";

type ButtonTypeProp = "similar" | "recommended" | "review";

export default function PreviewClientComponent() {
  const [toggleView, setToggleView] = useState<ButtonTypeProp>("similar");
  const containerRef = useRef<HTMLElement | null>(null);

  const handleToggleView = (value: ButtonTypeProp) => {
    if (value === toggleView) return;

    setToggleView(value);
  };

  // handle entry and exit animation on toggle
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(mediaQueries, (context) => {
        const { isDesktop } = context.conditions ?? {};

        if (isDesktop) {
          gsap.set(".panel--section__toggle", { clearProps: "all" });
          return;
        }

        if (!isDesktop) {
          const panelList = gsap.utils.toArray<HTMLDivElement>(
            ".panel--section__toggle",
            containerRef.current,
          );

          panelList.forEach((panel) => {
            const isCurrentPanel = panel.dataset.view === toggleView;

            if (isCurrentPanel) {
              // animate to view
              gsap.to(panel, {
                autoAlpha: 1,
                pointerEvents: "auto",
                duration: 0.3,
                ease: "power2.out",
              });
            } else {
              gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
            }
          });
        }
      });
    },
    { dependencies: [toggleView], scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="desktop:row-start-5 desktop:col-end-13 relative col-start-1 row-span-2 row-start-3 grid grid-cols-subgrid grid-rows-subgrid"
    >
      {/* Tab button list */}
      <ul className="desktop:hidden relative row-start-1 mx-3 mt-4 flex gap-1.5 overflow-x-auto pb-1.5">
        <li>
          <Button
            config={{
              type: toggleView === "similar" ? "tab-primary" : "secondary",
            }}
            onClick={() => handleToggleView("similar")}
          >
            Similar
          </Button>
        </li>
        <li>
          <Button
            config={{
              type: toggleView === "recommended" ? "tab-primary" : "secondary",
            }}
            onClick={() => handleToggleView("recommended")}
          >
            Recommended
          </Button>
        </li>
        <li>
          <Button
            config={{
              type: toggleView === "review" ? "tab-primary" : "secondary",
            }}
            onClick={() => handleToggleView("review")}
          >
            Review
          </Button>
        </li>
      </ul>

      <div
        className="panel--section__toggle col-start-1 row-start-2 grid items-start"
        data-view="review"
      >
        <ReviewSection />
      </div>

      {/* Similar and Recommendation List */}
      <Similar />
      <Recommendation />
    </section>
  );
}

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
        const panelList = gsap.utils.toArray<HTMLDivElement>(
          ".panel--section__toggle",
          containerRef.current,
        );
        if (isDesktop) {
          gsap.set(".panel--section__toggle", { clearProps: "all" });

          panelList.forEach((panel) => {
            const isCurrentPanel = panel.dataset.view === toggleView;
            const reviewPanel = panel.dataset.view === "review";

            if (isCurrentPanel && !reviewPanel) {
              // animate to view
              gsap.to(panel, {
                autoAlpha: 1,
                pointerEvents: "auto",
                duration: 0.3,
                ease: "power2.out",
              });
            } else if (!isCurrentPanel && !reviewPanel) {
              gsap.set(panel, { autoAlpha: 0, pointerEvents: "none" });
            }
          });
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
      className="desktop:col-end-13 desktop:row-start-7 relative col-start-1 row-span-2 row-start-3 grid grid-cols-subgrid grid-rows-[repeat(100,minmax(0,auto))]"
    >
      {/* Tab button list */}
      <ul className="desktop:col-start-8 desktop:col-end-13 desktop:row-span-2 desktop:row-start-2 relative row-start-1 mx-3 mt-4 flex gap-1.5 overflow-x-auto pb-1.5">
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
        <li className="desktop:hidden block">
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
        className="panel--section__toggle desktop:row-start-1 desktop:row-span-full desktop:col-span-7 col-start-1 row-start-2 grid grid-cols-subgrid items-start"
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

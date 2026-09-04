"use client";

import { useState, useTransition } from "react";
import SimRecSection from "./SimRecSection";
import ReviewSection from "./ReviewSection";
import Button from "@components/UI/Button";

type ButtonTypeProp = "similar" | "recommended" | "review";

/**
 * User interactive component on Preview page
 */
export default function PreviewClientComponent() {
  const [transitionToggleView, setTransitionToggleView] =
    useState<ButtonTypeProp>("similar"); // setting state inside transition
  const [snapToggleView, setSnapToggleView] =
    useState<ButtonTypeProp>("similar"); // setting state on button click
  const [isPending, startTransition] = useTransition(); // use to create a responsive loading display when switching to similar and recommended panels on smaller screens

  const handleToggleView = (value: ButtonTypeProp) => {
    if (value === snapToggleView) return;
    setSnapToggleView(value);
    startTransition(() => setTransitionToggleView(value));
  };

  return (
    <div className="desktop:row-start-5 desktop:col-end-13 col-start-1 row-span-10 row-start-3 grid grid-cols-subgrid grid-rows-subgrid">
      {/* Tab button list */}
      <ul className="desktop:hidden row-start-1 mx-3 mt-4 flex gap-1.5 overflow-x-auto pb-1.5">
        <li>
          <Button
            config={{
              type: snapToggleView === "similar" ? "tab-primary" : "secondary",
              isPending: isPending,
            }}
            onClick={() => handleToggleView("similar")}
          >
            Similar
          </Button>
        </li>
        <li>
          <Button
            config={{
              type:
                snapToggleView === "recommended" ? "tab-primary" : "secondary",
              isPending: isPending,
            }}
            onClick={() => handleToggleView("recommended")}
          >
            Recommended
          </Button>
        </li>
        <li>
          <Button
            config={{
              type: snapToggleView === "review" ? "tab-primary" : "secondary",
              isPending: isPending,
            }}
            onClick={() => handleToggleView("review")}
          >
            Review
          </Button>
        </li>
      </ul>
      {/* Reviews Section */}
      <ReviewSection isVisible={snapToggleView === "review"} />
      {/* Similar and Recommendation Section */}
      <SimRecSection
        isSimilar={transitionToggleView === "similar"}
        isVisible={snapToggleView !== "review"}
        isPending={isPending}
        // desktop props
        snapUpdate={snapToggleView === "similar"}
        handleDesktopViewSwitch={(showSimilar) =>
          handleToggleView(showSimilar ? "similar" : "recommended")
        }
      />
    </div>
  );
}

import { gsap } from "gsap";
import { ScrollTrigger, Observer } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Observer);

gsap.ticker.fps(45); // set lower FPS to reduce CPU workload
gsap.ticker.lagSmoothing(300, 96);
const mediaQueries = {
  isDesktop: "(min-width: 1024px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isMobile: "(max-width: 767px)",
};

export { gsap, useGSAP, mediaQueries, ScrollTrigger, Observer };

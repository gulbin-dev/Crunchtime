import { gsap } from "gsap";
import { ScrollTrigger, Observer } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Observer);

const mediaQueries = {
  isDesktop: "(min-width: 1024px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  isMobile: "(max-width: 767px)",
};

export { gsap, useGSAP, mediaQueries, ScrollTrigger, Observer };

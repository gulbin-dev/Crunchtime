import { gsap } from "gsap";
import { ScrollTrigger, Observer } from "gsap/all";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, Observer);

const mediaQueries = {
  desktop: "(min-width: 992px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  mobile: "(max-width: 767px)",
};

export { gsap, useGSAP, mediaQueries, ScrollTrigger, Observer };

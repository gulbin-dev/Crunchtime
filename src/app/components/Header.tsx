"use client";
import { useState, useEffect, useRef } from "react";
import Navigations from "./Navigations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@hooks/redux-typed-hooks";
import { LightModeIcon, DarkModeIcon } from "@utils/tabler-icons";
import { toggleTheme } from "@utils/redux-toolkit/slices/theme-slice";
import { gsap, useGSAP } from "@utils/gsap";

export default function Header() {
  const pathname = usePathname();
  const theme = useAppSelector((state) => state.theme.theme);
  const setTheme = useAppDispatch();
  const [isToggledMenu, setIsToggledMenu] = useState(false);
  const sideBarRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    document.body.style.overflow = isToggledMenu ? "hidden" : "auto";
  }, [isToggledMenu]);

  // Focus Trap Logic
  useEffect(() => {
    if (isToggledMenu && sideBarRef.current) {
      const focusableElements = sideBarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) firstElement.focus();
    }
  }, [isToggledMenu]);

  // GSAP Animations
  useGSAP(
    () => {
      const slices = gsap.utils.toArray<HTMLElement>(".hamburger-icon");
      gsap.defaults({
        ease: "power2.out",
        duration: 0.3,
        transformOrigin: "center center",
      });

      tl.current = gsap
        .timeline({ paused: true })
        .to(slices[0], { autoAlpha: 0, y: 10 })
        .to(slices[1], { rotate: 45, delay: 0.3 }, "<")
        .to(slices[2], { rotate: -45 }, "<")
        .to(slices[3], { autoAlpha: 0, y: -10 }, "<-=0.3")
        .fromTo(
          sideBarRef.current,
          { x: "100%", autoAlpha: 0 },
          { x: "0%", autoAlpha: 1, duration: 0.5 },
          "<",
        );
    },
    { scope: headerRef },
  );

  useGSAP(() => {
    if (isToggledMenu) tl.current?.play();
    else tl.current?.reverse();
  }, [isToggledMenu]);

  const toggleSideBarHandler = () => setIsToggledMenu((prev) => !prev);

  return (
    <>
      <header
        ref={headerRef}
        data-theme={theme}
        className="w-full h-10 bg-primary text-foreground-primary transition-colors duration-300 z-51 relative"
      >
        <div className="flex justify-between px-2 h-full w-full items-center place-self-center max-w-[768px]">
          <Link href="/" className="text-heading-lg  font-bold tablet:ml-3">
            CrunchTime
          </Link>
          <div className="flex gap-1.5 items-center">
            <button
              className="tablet:mr-1.5"
              onClick={() => setTheme(toggleTheme())}
              aria-label="Toggle light/dark mode"
            >
              <span
                className="sr-only"
                aria-label={
                  theme === "light"
                    ? "Light mode is active"
                    : "Dark mode is active"
                }
                aria-live="polite"
              ></span>
              {theme === "light" ? (
                <DarkModeIcon className="w-6 h-6  text-cta" />
              ) : (
                <LightModeIcon className="w-6 h-6 text-cta" />
              )}
            </button>

            <button
              ref={triggerRef}
              onClick={toggleSideBarHandler}
              className="flex flex-col w-6 h-10 gap-1  tablet:hidden"
              aria-label={
                isToggledMenu
                  ? "Close navigation panel"
                  : "Open navigation panel"
              }
              aria-expanded={isToggledMenu ? true : false}
              aria-controls="mobile-menu"
            >
              {" "}
              <span
                className="sr-only"
                aria-label={
                  isToggledMenu
                    ? "Navigation panel is open"
                    : "Navigation panel is closed"
                }
                aria-live="polite"
              ></span>
              <span
                className="hamburger-icon top-2.5"
                aria-hidden="true"
              ></span>
              <span
                className="hamburger-icon top-4.5"
                aria-hidden="true"
              ></span>
              <span
                className="hamburger-icon top-4.5"
                aria-hidden="true"
              ></span>
              <span
                className="hamburger-icon top-6.5"
                aria-hidden="true"
              ></span>
            </button>
            <nav className="hidden text-heading-md tablet:block tablet:mr-3">
              <ul className="flex gap-3">
                <li>
                  <Link
                    className={`${pathname === "/" ? "active" : ""}`}
                    href="/"
                    aria-current={pathname === "/" ? "page" : undefined}
                    data-nav-link
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${pathname === "/about" ? "active" : ""}`}
                    href="/about"
                    aria-current={pathname === "/about" ? "page" : undefined}
                    data-nav-link
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div
        data-theme={theme}
        ref={sideBarRef}
        id="mobile-menu"
        className="h-screen bg-primary w-screen overflow-hidden fixed top-0 left-0 z-30 pt-15 px-3 transition-colors duration-300"
        style={{
          transform: "translateX(100%)",
          visibility: "hidden", // GSAP handles this via autoAlpha
        }}
      >
        <Navigations
          navStyle="flex flex-col gap-2 items-end pr-3"
          anchorStyle="text-heading-lg text-cta"
          updateState={setIsToggledMenu}
          currentPath={pathname}
        />
      </div>
    </>
  );
}

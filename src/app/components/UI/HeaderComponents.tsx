"use client";
import { useEffect, useRef, Dispatch, SetStateAction, RefObject } from "react";
import { useAppDispatch } from "@hooks/redux-typed-hooks";
import { LightModeIcon, DarkModeIcon } from "@utils/tabler-icons";
import { toggleTheme } from "@utils/redux-toolkit/slices/theme-slice";
import { gsap, useGSAP } from "@utils/gsap";
import Navigations from "@components/Navigations";

interface SidebarButton {
  isToggledMenu: boolean;
  setIsToggledMenu: Dispatch<SetStateAction<boolean>>;
  sidebarRef: RefObject<HTMLDivElement | null>;
  pathname: string;
  theme: "light" | "dark";
  className: string;
}
interface SidebarContainerProp {
  theme: "light" | "dark";
  sidebarRef: RefObject<HTMLDivElement | null>;
  setIsToggledMenu: Dispatch<SetStateAction<boolean>>;
  pathname: string;
}

export const SidebarButton = ({
  isToggledMenu,
  setIsToggledMenu,
  sidebarRef,
  pathname,
  theme,
  className,
}: SidebarButton) => {
  const tl = useRef<gsap.core.Timeline | null>(null); // tracking gsap timeline persistently
  // Focus Trap Logic
  useEffect(() => {
    if (isToggledMenu && sidebarRef.current) {
      const focusableElements = sidebarRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) firstElement.focus();
    }
  }, [isToggledMenu, sidebarRef]);

  // Animations when toggling the menu button
  useGSAP(() => {
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
        sidebarRef.current,
        { x: "100%", autoAlpha: 0 },
        { x: "0%", autoAlpha: 1, duration: 0.5 },
        "<",
      );
  });

  useGSAP(() => {
    // Toggle scrolling on page on small screen
    document.body.style.overflow = isToggledMenu ? "hidden" : "auto";

    // toggling timeline playback
    if (isToggledMenu) tl.current?.play();
    else tl.current?.reverse();
  }, [isToggledMenu]);
  return (
    <>
      <button
        onClick={() => setIsToggledMenu((prev) => !prev)}
        className={`relative z-2 flex h-6 w-6 flex-col gap-1 ${className}`}
        aria-label={
          isToggledMenu ? "Close navigation panel" : "Open navigation panel"
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
        <span className="hamburger-icon top-0" aria-hidden="true" />
        <span className="hamburger-icon top-2" aria-hidden="true" />
        <span className="hamburger-icon top-2" aria-hidden="true" />
        <span className="hamburger-icon top-4" aria-hidden="true" />
      </button>
      {/* Sidebar container */}
      <SidebarContainer
        theme={theme}
        sidebarRef={sidebarRef}
        setIsToggledMenu={setIsToggledMenu}
        pathname={pathname}
      />
    </>
  );
};

export const ThemeButton = ({
  theme,
  className,
  setIsToggledMenu,
}: {
  theme: "light" | "dark";
  className: string;
  setIsToggledMenu?: Dispatch<SetStateAction<boolean>>;
}) => {
  const setTheme = useAppDispatch();
  return (
    <button
      className={`tablet:mr-1.5 ${className}`}
      onClick={() => {
        setTheme(toggleTheme());
        if (setIsToggledMenu) setIsToggledMenu((prev) => !prev);
      }}
      aria-label="Toggle light/dark mode"
    >
      <span
        className="sr-only"
        aria-label={
          theme === "light" ? "Light mode is active" : "Dark mode is active"
        }
        aria-live="polite"
      ></span>
      {theme === "light" ? (
        <DarkModeIcon className="text-cta size-6" />
      ) : (
        <LightModeIcon className="text-cta size-6" />
      )}
    </button>
  );
};

const SidebarContainer = ({
  theme,
  sidebarRef,
  setIsToggledMenu,
  pathname,
}: SidebarContainerProp) => {
  return (
    <div
      data-theme={theme}
      ref={sidebarRef}
      id="mobile-menu"
      className="bg-primary fixed top-0 left-0 z-1 flex h-screen w-screen flex-col items-end gap-2 overflow-hidden px-3 pt-15 transition-colors duration-300"
      style={{
        transform: "translateX(100%)",
        visibility: "hidden",
      }}
    >
      <Navigations
        navStyle="flex flex-col gap-2 items-end pr-3"
        anchorStyle="text-heading-lg text-cta"
        updateState={setIsToggledMenu}
        currentPath={pathname}
      />

      {/* Theme toggle button */}
      <ThemeButton
        theme={theme}
        className="mr-3"
        setIsToggledMenu={setIsToggledMenu}
      />
    </div>
  );
};

"use client";
import { useState, useEffect, useRef } from "react";
import Navigations from "./Navigations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useTheme } from "../utils/zustand/theme";
import { topDownSpan } from "../utils/motion/variants";
import { MdLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

export default function Header() {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const setTheme = useTheme((state) => state.setTheme);
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    const buttonEl = buttonRef.current;
    if (
      isMobileNavOpen &&
      buttonEl?.getAttribute("aria-expanded") === "false"
    ) {
      document.body.style.overflow = "hidden";
      buttonEl?.setAttribute("aria-expanded", "true");
    }

    return () => {
      document.body.style.overflow = "auto";
      buttonEl?.setAttribute("aria-expanded", "false");
    };
  }, [isMobileNavOpen]);

  return (
    <>
      <header
        className={`w-full h-10  ${theme === "light" ? "bg-light text-dark" : "bg-dark text-light"}`}
      >
        <div className="flex justify-between px-2 h-full w-full items-center place-self-center max-w-[768px]">
          <Link href="/" className="text-heading-lg  font-bold tablet:ml-3">
            CrunchTime
          </Link>
          <div className="flex gap-1.5 items-center">
            <motion.button
              className="tablet:mr-1.5"
              onClick={setTheme}
              animate={{ rotate: theme === "light" ? [0, 360] : [360, 0] }}
              transition={{ duration: 0.4 }}
              aria-label={
                theme === "light"
                  ? "Change to dark mode"
                  : "Change to light mode"
              }
            >
              {theme === "light" ? (
                <MdDarkMode className="w-6 h-6  text-cta" />
              ) : (
                <MdLightMode className="w-6 h-6 text-cta" />
              )}
            </motion.button>
            <motion.button
              ref={buttonRef}
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="flex flex-col w-6 h-10 gap-1  tablet:hidden"
              aria-label={
                isMobileNavOpen
                  ? "Close navigation panel"
                  : "Open navigation panel"
              }
              aria-expanded={isMobileNavOpen ? true : false}
              aria-controls="mobile-menu"
            >
              <motion.span
                animate={isMobileNavOpen ? "open" : "close"}
                variants={topDownSpan}
                className="hamburger-icon top-2.5"
                aria-hidden="true"
              ></motion.span>
              <motion.span
                animate={isMobileNavOpen ? { rotate: 45 } : { rotate: 0 }}
                transition={
                  isMobileNavOpen ? { duration: 0.3 } : { duration: 0.1 }
                }
                className="hamburger-icon top-4.5"
                aria-hidden="true"
              ></motion.span>
              <motion.span
                animate={isMobileNavOpen ? { rotate: -45 } : { rotate: 0 }}
                transition={
                  isMobileNavOpen ? { duration: 0.3 } : { duration: 0.1 }
                }
                className="hamburger-icon top-4.5"
                aria-hidden="true"
              ></motion.span>
              <motion.span
                animate={isMobileNavOpen ? "open" : "close"}
                variants={topDownSpan}
                className="hamburger-icon top-6.5"
                aria-hidden="true"
              ></motion.span>
            </motion.button>
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
      {isMobileNavOpen && (
        <div
          id="mobile-menu"
          className={`bg-primary-color-darker w-full h-screen relative top-0 left-0 z-10 py-5 ${theme === "light" ? "bg-light" : "bg-dark"}`}
        >
          <Navigations
            navStyle="flex flex-col gap-2 items-end pr-3"
            anchorStyle="text-heading-lg text-cta"
            updateState={setIsMobileNavOpen}
            currentPath={pathname}
          />
        </div>
      )}
    </>
  );
}

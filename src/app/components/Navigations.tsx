"use client";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
export default function Navigations({
  navStyle,
  anchorStyle,
  updateState,
  currentPath,
}: {
  navStyle: string;
  anchorStyle: string;
  updateState?: Dispatch<SetStateAction<boolean>> | undefined;
  currentPath: string;
}) {
  function handleStateUpdate() {
    if (updateState !== undefined) {
      // Typically, for closing a menu, you'd set this to false
      // rather than toggling, but keeping your logic:
      updateState(false);
    }
  }

  return (
    <nav>
      <ul className={navStyle}>
        <li>
          <Link
            className={anchorStyle}
            href="/"
            onClick={handleStateUpdate}
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={anchorStyle}
            href="/about"
            onClick={handleStateUpdate}
            aria-current={currentPath === "/about" ? "page" : undefined}
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

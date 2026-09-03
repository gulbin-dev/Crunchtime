"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@hooks/redux-typed-hooks";
import SearchUI from "./SearchUI";
import FeatureFlagWrapper from "./FeatureFlag";
import { SidebarButton, ThemeButton } from "@components/UI/SidebarModal";
import Account from "@components/Account";

export default function Header() {
  const pathname = usePathname(); // reading current the URl subpath
  const [isToggledMenu, setIsToggledMenu] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <header
        data-theme={theme}
        className="bg-primary text-foreground-primary relative z-50! h-10 w-full transition-colors duration-300"
      >
        <div className="flex h-full w-full items-center justify-between place-self-center px-2">
          <Link
            href="/"
            className="text-heading-lg tablet:ml-3 relative z-2 font-bold"
          >
            CrunchTime
          </Link>
          <SearchUI
            className="desktop:block hidden"
            inputId="search-on-desktop-header"
          />
          <div className="desktop:grid-cols-[auto_max-content_max-content] desktop:gap-2.5 grid grid-cols-2 grid-rows-1 items-center gap-1.5">
            {/* Sidebar button */}
            <SidebarButton
              className="desktop:hidden col-start-2 row-start-1"
              isToggledMenu={isToggledMenu}
              setIsToggledMenu={setIsToggledMenu}
              sidebarRef={sidebarRef}
              pathname={pathname}
              theme={theme}
            />
            {/* Navigation */}
            <nav className="text-heading-sm desktop:text-heading-md desktop:block tablet:mr-3 desktop:col-start-1 hidden">
              <ul className="flex gap-3">
                <li>
                  <Link
                    className={`${pathname === "/" ? "active" : ""}`}
                    href="/"
                    aria-current={pathname === "/" ? "page" : undefined}
                    data-nav-link // css styling
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className={`${pathname === "/about" ? "active" : ""}`}
                    href="/about"
                    aria-current={pathname === "/about" ? "page" : undefined}
                    data-nav-link // css styling
                  >
                    About
                  </Link>
                </li>
              </ul>
            </nav>
            {/* Theme toggle button */}
            <ThemeButton
              theme={theme}
              className="desktop:block desktop:col-start-3 hidden"
            />
            {/* Account button */}
            <FeatureFlagWrapper featureFlag="ACCOUNT_FLAG">
              <Account className="desktop:col-start-2 relative z-2 col-start-1 row-start-1" />
            </FeatureFlagWrapper>
          </div>
        </div>
      </header>
      <div></div>
    </>
  );
}

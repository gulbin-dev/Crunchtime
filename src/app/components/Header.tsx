"use client";
import {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  RefObject,
} from "react";
import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@hooks/redux-typed-hooks";
import { LightModeIcon, DarkModeIcon, AccountIcon } from "@utils/tabler-icons";
import { toggleTheme } from "@utils/redux-toolkit/slices/theme-slice";
import { gsap, useGSAP } from "@utils/gsap";
import SearchUI from "./SearchUI";
import Navigations from "./Navigations";
import { fetcher } from "@utils/swr/fetcher";

interface SidebarButton {
  isToggledMenu: boolean;
  setIsToggledMenu: Dispatch<SetStateAction<boolean>>;
  sidebarRef: RefObject<HTMLDivElement | null>;
  headerRef: RefObject<HTMLElement | null>;
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
interface RequestTokenType {
  expires_at: string;
  request_token: string;
  success: string;
}

const SidebarButton = ({
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
  const handleToggleSidebar = () => setIsToggledMenu((prev) => !prev);

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
        onClick={handleToggleSidebar}
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
        <span className="hamburger-icon top-0" aria-hidden="true"></span>
        <span className="hamburger-icon top-2" aria-hidden="true"></span>
        <span className="hamburger-icon top-2" aria-hidden="true"></span>
        <span className="hamburger-icon top-4" aria-hidden="true"></span>
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

const ThemeButton = ({
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

const AccountButton = ({ className }: { className: string }) => {
  const [hasRequestedNewToken, setHasRequestedNewToken] = useState(false);
  const [hasRequestedLogout, setHasRequestedLogout] = useState(false);
  const [isDrawerToggled, setIsDrawerToggled] = useState<boolean>(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data: requestTokenData } = useSWR<RequestTokenType>(
    hasRequestedNewToken ? "/api/account/request-token" : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    },
  );
  const user = {
    id: null,
  };
  console.log(requestTokenData);
  // animation for account drawer
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .to(".account-drawer__ul--toggle", {
          autoAlpha: 1,
          y: 0,
        });
    },
    { scope: containerRef },
  );

  useGSAP(() => {
    if (isDrawerToggled) tl.current?.play();
    else tl.current?.reverse();
  }, [isDrawerToggled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerToggled(false);
      }
    };

    if (isDrawerToggled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerToggled]);

  useEffect(() => {
    if (!requestTokenData?.success) return;
    const redirectUrl = new URL(
      `https://www.themoviedb.org/authenticate/${requestTokenData.request_token}?redirect_to=http://localhost:3000/auth-callback`,
    );
    window.location.href = redirectUrl.toString();
  }, [requestTokenData]);
  const handleRequestAuth = () => {
    console.log("login button");
    setHasRequestedNewToken(true);
  };

  const handleLogout = () => {};
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button onClick={() => setIsDrawerToggled((prev) => !prev)}>
        {user?.id ? (
          <Image
            src="https://gravatar.com/avatar/457a687caaf5337aa95d29604513724b?d=mp"
            className="size-6 rounded-full"
            alt=""
            width={100}
            height={100}
          />
        ) : (
          <AccountIcon className="text-cta size-6" />
        )}
      </button>
      <ul
        className={`account-drawer__ul--toggle text-heading-md invisible absolute top-full -left-1/2 -translate-y-5 rounded-sm px-1.5 shadow-sm shadow-gray-500 ${theme === "light" ? "bg-primary-shade" : "bg-dark-shade"}`}
      >
        {user?.id ? (
          <>
            <li className="border-b px-1.5">
              <button className="py-1">Profile</button>
            </li>
            <li className="px-1.5">
              <button className="py-1" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="px-1.5">
              <button className="py-1" onClick={handleRequestAuth}>
                Login
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
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

export default function Header() {
  const pathname = usePathname(); // reading current the URl subpath
  const [isToggledMenu, setIsToggledMenu] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  return (
    <>
      <header
        ref={headerRef}
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
              headerRef={headerRef}
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
            <AccountButton className="desktop:col-start-2 relative z-2 col-start-1 row-start-1" />
          </div>
        </div>
      </header>
    </>
  );
}

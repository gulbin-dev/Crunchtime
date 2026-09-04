"use client";

import useSWR from "swr";
import { useState, Suspense, useRef, useEffect, useLayoutEffect } from "react";
import { useCatalogState } from "@hooks/useCatalogState";
import { FetchResponse, MediaTypes } from "@utils/types";
import { normalizeData } from "@utils/normalizeData";
import { CloseIcon, SadIcon, SearchIcon } from "@utils/tabler-icons";
import { fetcher } from "@utils/swr/fetcher";
import { gsap, useGSAP } from "@utils/gsap";
import QueryCard from "./QueryCard";
import LoaderCardPoster from "./UI/LoaderCardPoster";
import PageLoader from "./UI/PageLoader";
import Button from "./UI/Button";
import ButtonTabPill from "./ButtonTabPill";

export default function SearchUI({
  className,
  inputId,
}: {
  className?: string;
  inputId: string;
}) {
  const [query, setQuery] = useState("");
  const { catalog, setCatalog } = useCatalogState();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const innerContentRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const movieTabRef = useRef<HTMLButtonElement | null>(null);
  const tvTabRef = useRef<HTMLButtonElement | null>(null);
  const { data, isLoading, error } = useSWR(
    query.length > 0 ? `/api/search?query=${query}&media=${catalog}` : null,
    (url: string) => fetcher<FetchResponse<MediaTypes>>(url),
  );

  const normalized = data ? normalizeData(data.results) : [];

  useEffect(() => {
    document.body.style.overflow = isSearchModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSearchModalOpen]);

  // Open modal using native HTML5 API
  const handleOpen = () => {
    dialogRef.current?.showModal();
    setIsSearchModalOpen(true);
  };

  // Close modal using GSAP animation first, then call native close
  const handleClose = () => {
    gsap.to(innerContentRef.current, {
      y: "102%",
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        dialogRef.current?.close();
        setIsSearchModalOpen(false);
        setQuery(""); // Reset search input on close
      },
    });
  };

  // Slide the segmented indicator under the active tab
  useLayoutEffect(() => {
    if (!isSearchModalOpen) return;
    const target = catalog === "movie" ? movieTabRef.current : tvTabRef.current;
    const indicator = indicatorRef.current;
    if (!target || !indicator) return;
    indicator.style.left = `${target.offsetLeft}px`;
    indicator.style.width = `${target.offsetWidth}px`;
  }, [catalog, isSearchModalOpen]);

  useGSAP(() => {
    if (isSearchModalOpen) {
      /*
        Using fromTo forces GSAP to instantly snap the element to a 102% offset
        on the GPU thread, killing the native browser layout-flash completely.
      */
      gsap.fromTo(
        innerContentRef.current,
        { y: "102%" },
        {
          y: 0,
          duration: 0.45,
          ease: "power3.out", // Smooth deceleration curve
          onComplete: () => {
            inputRef.current?.focus();
          },
        },
      );
    }
  }, [isSearchModalOpen]);

  return (
    <div className={className}>
      <Button
        onClick={handleOpen}
        className="relative z-2 m-3 flex items-center justify-center gap-0.75 rounded-xl font-light shadow-md hover:shadow-lg"
        aria-label="Open search modal"
        config={{ type: "primary" }}
      >
        <SearchIcon size={18} className="text-white" />
        <span className="desktop:block hidden text-white">
          Find what you want to watch
        </span>
      </Button>
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onClick={handleClose}
        className="text-foreground-primary fixed inset-0 z-50 m-0 h-dvh max-h-dvh w-screen max-w-none overflow-hidden border-0 bg-transparent p-0 backdrop:bg-black/60 backdrop:backdrop-blur-md"
      >
        <span
          className="sr-only"
          aria-live="polite"
          aria-label={
            isSearchModalOpen
              ? "Search modal is open"
              : "Search modal is closed"
          }
        />

        <div
          ref={innerContentRef}
          onClick={(e) => e.stopPropagation()}
          className="tablet:inset-x-auto tablet:right-4 tablet:left-4 tablet:bottom-8 tablet:top-auto tablet:h-[85vh] tablet:max-w-80 tablet:rounded-3xl tablet:pt-6 tablet:mx-auto desktop:max-w-120 border-gray-shade/15 bg-primary/85 supports-backdrop-filter:bg-primary/70 tablet:border dark:bg-primary/85 dark:supports-backdrop-filter:bg-primary/70 fixed inset-x-0 top-0 bottom-0 z-10 flex h-dvh w-full flex-col items-stretch overflow-hidden border px-4 pt-6 pb-4 shadow-2xl backdrop-blur-2xl will-change-transform"
          style={{
            transform: isSearchModalOpen ? "translateY(0)" : "translateY(102%)",
          }}
        >
          {/* Decorative animated background orbs */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="animate-orb-drift bg-cta/45 absolute -top-16 -right-12 h-56 w-56 rounded-full blur-3xl" />
            <div className="animate-orb-drift-alt bg-secondary/35 absolute -bottom-16 -left-12 h-56 w-56 rounded-full blur-3xl" />
            <div className="to-primary/40 absolute inset-0 bg-linear-to-b from-transparent via-transparent" />
          </div>

          {/* Header & Controls Section */}
          <div className="relative z-10 mb-5 flex w-full flex-col gap-4">
            {/* Title & Close Row */}
            <div className="flex w-full items-center justify-between gap-3">
              <div className="min-w-0">
                <label
                  className="text-heading-md text-foreground-primary block truncate font-bold tracking-tight"
                  htmlFor={inputId}
                >
                  Explore
                </label>
                <p className="text-foreground-primary/70 mt-0.5 text-xs font-medium">
                  Movies & TV Shows at your fingertips
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close search modal"
                className="hover:bg-cta/15 hover:text-cta border-gray-shade/20 bg-primary-shade/60 hover:border-cta/40 focus-visible:ring-cta/60 inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-white transition-all duration-300 hover:rotate-90 focus:outline-none focus-visible:ring-2"
              >
                <CloseIcon size={20} aria-hidden />
              </button>
            </div>

            {/* Input Bar & Type Tabs Segment */}
            <div className="grid w-full grid-cols-3 grid-rows-2 gap-3">
              <div className="desktop:col-start-1 desktop:col-span-2 relative col-span-full row-start-1 flex">
                <span
                  className="peer-focus:text-cta pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-mauve-800 transition-colors duration-200"
                  aria-hidden="true"
                >
                  <SearchIcon size={18} />
                </span>
                <input
                  type="text"
                  id={inputId}
                  ref={inputRef}
                  value={query}
                  className="peer border-gray-shade/50 hover:border-cta/40 focus:border-cta focus:ring-cta/20 w-full rounded-2xl border bg-white px-3 py-1.75 pl-5 text-sm font-medium text-black shadow-sm transition-all duration-200 placeholder:text-mauve-800 focus:bg-white focus:shadow-md focus:ring-4 focus:outline-none"
                  placeholder="Search for a movie, show, or genre…"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <ButtonTabPill
                options={[
                  {
                    value: "movie",
                    label: "Movies",
                    ariaLabel: "Search movies",
                  },
                  {
                    value: "tv",
                    label: "TV Series",
                    ariaLabel: "Search TV series",
                  },
                ]}
                value={catalog}
                onChange={() => setCatalog(catalog)}
                ariaLabel="Media type"
                buttonClassName="tab-pill__btn relative z-10 flex-1"
              />
            </div>
          </div>

          {/* Content / Results Body */}
          <div className="scroller relative z-10 min-h-0 w-full flex-1 overflow-y-auto pr-1">
            {isLoading && query.length > 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <PageLoader />
                <p className="text-foreground-primary/60 text-xs font-medium">
                  Searching for &quot;{query}&quot;…
                </p>
              </div>
            )}

            {/* Grid Layout Cards */}
            <ul className="tablet:grid-cols-3 desktop:grid-cols-4 my-1 grid w-full grid-cols-2 gap-3 pb-2">
              {normalized.map((item, idx) => (
                <li
                  key={item.id}
                  className="animate-fade-in-up w-full list-none"
                  style={{ animationDelay: `${Math.min(idx, 11) * 35}ms` }}
                >
                  <Suspense fallback={<LoaderCardPoster />}>
                    <QueryCard item={item} catalog={catalog} />
                  </Suspense>
                </li>
              ))}
            </ul>

            {/* Empty state */}
            {!isLoading &&
              !error &&
              query.length > 0 &&
              normalized.length === 0 && (
                <div className="animate-fade-in-up mt-6 flex flex-col items-center justify-center gap-2 text-center">
                  <div className="bg-cta/10 text-cta flex h-14 w-14 items-center justify-center rounded-full">
                    <SadIcon size={28} />
                  </div>
                  <p className="text-foreground-primary text-sm font-semibold">
                    No results found
                  </p>
                  <p className="text-foreground-primary/60 text-xs">
                    Nothing matched &quot;
                    <span className="text-foreground-primary font-semibold">
                      {query}
                    </span>
                    &quot;. Try a different keyword.
                  </p>
                </div>
              )}

            {/* Idle hint state */}
            {!isLoading && !error && query.length === 0 && (
              <div className="animate-fade-in-up mt-8 flex flex-col items-center justify-center gap-2 text-center">
                <div className="bg-cta/10 text-cta flex h-14 w-14 items-center justify-center rounded-full">
                  <SearchIcon size={26} />
                </div>
                <p className="text-foreground-primary text-sm font-semibold">
                  Start typing to search
                </p>
                <p className="text-foreground-primary/60 max-w-32.5 text-xs">
                  Discover trending movies and series from our curated library.
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="animate-fade-in-up mt-6 flex flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <SadIcon size={28} />
                </div>
                <p className="text-foreground-primary text-sm font-semibold">
                  Something went wrong
                </p>
                <p className="text-foreground-primary/60 text-xs">
                  An unexpected error has occurred. Please try again.
                </p>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}

"use client";

import useSWR from "swr";
import { useState, Suspense, useRef, useEffect } from "react";
import { FetchResponse, MediaTypes } from "@utils/types";
import QueryCard from "./QueryCard";
import { normalizeData } from "@utils/normalizeData";
import { CloseIcon, SearchIcon } from "@utils/tabler-icons";
import LoaderCardPoster from "./UI/LoaderCardPoster";
import PageLoader from "./UI/PageLoader";
import { fetcher } from "@utils/swr/fetcher";
import { gsap, useGSAP } from "@utils/gsap";
import Button from "./UI/Button";

export default function SearchUI() {
  const [query, setQuery] = useState("");
  const [isMovie, setIsMovie] = useState(true);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const innerContentRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, error } = useSWR(
    (query.length > 0 && isMovie) || (query.length > 0 && !isMovie)
      ? `/api/search?query=${query}&media=${isMovie ? "movie" : "tv"}`
      : null,
    (url: string) => fetcher<FetchResponse<MediaTypes>>(url),
  );
  const normalized = data ? normalizeData(data.results) : [];

  useEffect(() => {
    document.body.style.overflow = isSearchModalOpen ? "hidden" : "auto";
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
    <>
      <Button
        onClick={handleOpen}
        className="mx-3 my-3 flex gap-1 py-1.5 px-3 tablet:w-40 tablet:mt-3 tablet:ml-15"
        ariaLabel="Open search modal"
      >
        <SearchIcon size={24} /> Find you want to watch...
      </Button>
      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault(); // Stop native instant close so GSAP can animate out
          handleClose();
        }}
        onClick={handleClose}
        className="fixed inset-0 z-1 h-dvh w-screen m-0 max-w-none max-h-dvh bg-transparent text-foreground-primary backdrop:bg-black/50 overflow-hidden desktop:inset-25"
      >
        <span
          className="sr-only"
          aria-live="polite"
          aria-label={
            isSearchModalOpen
              ? "Search modal is open"
              : "Search modal is closed"
          }
        ></span>
        <div
          ref={innerContentRef}
          onClick={(e) => e.stopPropagation()}
          className="bg-primary fixed inset-0 h-[102dvh] w-full pt-6 pb-3 px-3 flex flex-col place-items-center overflow-y-auto  will-change-transform tablet:max-w-80 tablet:h-[85vh] tablet:bottom-10 tablet:top-auto tablet:rounded-2xl tablet:pt-3 tablet:mx-auto desktop:max-w-140"
          style={{ transform: "translateY(102%)" }}
        >
          <div className="w-full mb-4 grid grid-cols-4 grid-rows-auto auto-rows-[80px] gap-1 place-items-center tablet:grid-cols-6 desktop:grid-cols-8">
            <Button
              onClick={handleClose}
              className="p-1.5 col-start-4 row-start-1 tablet:col-start-6 desktop:col-start-8"
              ariaLabel="Close search modal"
            >
              <CloseIcon size={24} aria-hidden />
            </Button>
            <label
              className="font-bold text-lg col-start-1 col-span-3 row-start-1 self-end"
              htmlFor="search"
            >
              Finding Movies/TV shows
            </label>
            <input
              type="text"
              id="search"
              ref={inputRef}
              value={query}
              className="p-1.5 rounded-sm w-full col-start-1 col-span-full row-start-2 bg-white text-foreground-dark border-2 border-cta tablet:col-start-1 tablet:col-span-4 tablet:w-[80%]"
              placeholder="Type to search..."
              onChange={(e) => setQuery(e.target.value)}
            />
            <div
              className="flex col-start-1 col-span-full row-start-3 justify-center items-center desktop:col-start-5 desktop:col-span-2 desktop:row-start-2 desktop:justify-self-start"
              role="tablist"
            >
              <Button
                className={`w-10 h-fit py-1 px-2 rounded-l-md rounded-r-none font-bold ${isMovie ? "bg-cta" : "bg-cta-secondary"}`}
                onClick={() => setIsMovie(true)}
                role="tab"
              >
                Movie
              </Button>
              <Button
                className={`w-10 h-fit py-1 px-2 rounded-r-md rounded-l-none  font-bold ${!isMovie ? "bg-cta" : "bg-cta-secondary"}`}
                onClick={() => setIsMovie(false)}
                role="tab"
              >
                TV
              </Button>
            </div>
          </div>

          <div className="w-full flex-1">
            {isLoading && query.length > 0 && (
              <div className="py-10 flex justify-center">
                <PageLoader />
              </div>
            )}

            {/* CHANGED: Clean responsive grid for results */}
            <ul className="my-2 grid grid-cols-2 gap-4 w-full tablet:grid-cols-3 desktop:grid-cols-4">
              {normalized.map((item) => (
                <li key={item.id} className="w-full list-none">
                  <Suspense fallback={<LoaderCardPoster />}>
                    <QueryCard item={item} isMovie={isMovie} />
                  </Suspense>
                </li>
              ))}
            </ul>

            {error && (
              <p className="text-center mt-10">An error has occurred</p>
            )}

            {!isLoading && query.length > 0 && normalized.length === 0 && (
              <p className="text-center mt-10">
                No results found for &quot;{query}&quot;
              </p>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

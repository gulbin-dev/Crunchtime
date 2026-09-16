"use client";

import {
  useState,
  Suspense,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
  RefObject,
  memo,
  useCallback,
} from "react";
import { useParams } from "next/navigation";
import LoaderCardPoster from "./UI/LoaderCardPoster";
import PageLoader from "./UI/PageLoader";
import Button from "./UI/Button";
import ButtonTabPill from "./ButtonTabPill";
import QueryList from "./QueryList";
import useDebounceAValue from "@hooks/useDebounceAValue";
import { useCatalogState } from "@hooks/useCatalogState";
import { gsap, useGSAP } from "@utils/gsap";
import { CloseIcon, SearchIcon } from "@utils/tabler-icons";

interface DialogProp {
  inputId: string;
  dialogRef: RefObject<HTMLDialogElement | null>;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SearchUI = memo(function SearchUI({ inputId }: { inputId: string }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  // Open modal using native HTML5 API
  const handleOpen = () => {
    dialogRef.current?.show();
    setIsSearchModalOpen(true);
  };

  return (
    <>
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

      <Dialog
        inputId={inputId}
        dialogRef={dialogRef}
        isSearchModalOpen={isSearchModalOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
      />
    </>
  );
});

const Dialog = memo(function Dialog({
  inputId,
  isSearchModalOpen,
  dialogRef,
  setIsSearchModalOpen,
}: DialogProp) {
  const param = useParams();
  const [query, setQuery] = useState("");
  const { catalog, setCatalog } = useCatalogState();
  const [debouncedValue, isDelayed] = useDebounceAValue(query);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const innerContentRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Close modal using GSAP animation first, then call native close
  const handleClose = useCallback(() => {
    tweenRef.current?.reverse();
  }, []);

  // close modal when navigating
  useEffect(() => {
    handleClose();
  }, [param, handleClose]);

  useGSAP(() => {
    if (!innerContentRef.current || !inputRef.current) return;
    tweenRef.current = gsap.to(innerContentRef.current, {
      y: 0,
      duration: 0.45,
      ease: "power3.out", // Smooth deceleration curve
      onComplete: () => {
        requestAnimationFrame(() => inputRef.current?.focus());
      },
      onReverseComplete: () => {
        // This fires automatically whenever the timeline finishes reversing
        if (dialogRef.current) {
          dialogRef.current.close();
          dialogRef.current.style.contentVisibility = "hidden";
        }
        setIsSearchModalOpen(false);
        setQuery("");
      },
    });
  }, []);

  useGSAP(
    () => {
      if (!tweenRef.current || !dialogRef.current) return;
      const dialog = dialogRef.current;
      if (isSearchModalOpen) {
        dialog.style.contentVisibility = "visible";
        tweenRef.current.play();
      }
    },
    {
      dependencies: [isSearchModalOpen],
      scope: dialogRef,
    },
  );

  return (
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
          isSearchModalOpen ? "Search modal is open" : "Search modal is closed"
        }
      />

      <div
        ref={innerContentRef}
        onClick={(e) => e.stopPropagation()}
        className="tablet:inset-x-auto tablet:right-4 tablet:left-4 tablet:bottom-8 tablet:top-auto tablet:h-[85vh] tablet:max-w-80 tablet:rounded-3xl tablet:pt-6 tablet:mx-auto desktop:max-w-120 border-gray-shade/15 bg-primary/85 supports-backdrop-filter:bg-primary/70 tablet:border dark:bg-primary/85 dark:supports-backdrop-filter:bg-primary/70 fixed inset-x-0 top-0 bottom-0 z-10 flex h-dvh w-[101%] translate-y-full flex-col items-stretch overflow-hidden border px-4 pt-6 pb-4 shadow-2xl backdrop-blur-2xl will-change-transform"
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
              setCatalog={setCatalog}
              ariaLabel="Media type"
              buttonClassName="flex-1"
            />
          </div>
        </div>

        {/* Content / Results Body */}
        <div className="scroller relative z-10 min-h-0 w-full flex-1 overflow-y-auto pr-1">
          {isDelayed && query.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <PageLoader />
              <p className="text-foreground-primary/60 text-xs font-medium">
                Searching for &quot;{query}&quot;…
              </p>
            </div>
          )}

          {/* Grid Layout Cards */}
          <ul className="tablet:grid-cols-3 desktop:grid-cols-4 my-1 grid w-full grid-cols-2 gap-3 pb-2">
            {!isDelayed && (
              <Suspense
                fallback={Array.from({ length: 10 }, (_, idx) => (
                  <li
                    key={idx}
                    className="animate-fade-in-up w-full list-none"
                    style={{ animationDelay: `${Math.min(idx, 11) * 35}ms` }}
                  >
                    <LoaderCardPoster />
                  </li>
                ))}
              >
                <QueryList debouncedValue={debouncedValue} catalog={catalog} />
              </Suspense>
            )}
          </ul>

          {/* Idle hint state */}
          {!isDelayed && query.length === 0 && <IdleState />}
        </div>
      </div>
    </dialog>
  );
});

const IdleState = () => (
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
);

export default SearchUI;

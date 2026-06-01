"use client";
import useSWR from "swr";
import { useState, Suspense, useRef } from "react";
import { FetchResponse, MediaTypes } from "../utils/types";
import QueryCard from "./QueryCard";
import { normalizeData } from "@utils/normalizeData";
import { TbLetterX } from "react-icons/tb";
import LoaderCardPoster from "./UI/LoaderCardPoster";
import PageLoader from "./UI/PageLoader";
import { fetcher } from "@utils/swr/fetcher";
import { motion } from "motion/react";
export default function SearchUI() {
  const [query, setQuery] = useState("");
  const [isMovie, setIsMovie] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const { data, isLoading, error } = useSWR(
    (query.length > 0 && isMovie) || (query.length > 0 && !isMovie)
      ? `/api/search?query=${query}&media=${isMovie ? "movie" : "tv"}`
      : null,
    (url: string) => fetcher<FetchResponse<MediaTypes>>(url),
  );
  const normalized = data ? normalizeData(data) : [];

  return (
    <>
      <button
        className="bg-cta  text-light font-bold py-0.5 px-3 mx-3 mt-3 rounded-lg tablet:w-40 tablet:mt-3 tablet:ml-15"
        onClick={toggleModal}
        hidden={isModalOpen}
      >
        Find you want to watch...
      </button>
      <motion.dialog
        ref={dialogRef}
        closedby="any"
        className="bg-dark-50 fixed w-full h-screen text-light place-self-center z-30 duration-100 overflow-x-hidden"
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 200 }}
        key="dialog"
      >
        <button
          className="float-right bg-cta w-6 h-6 rounded-lg text-light my-4 mr-3"
          aria-label="go back to homepage"
        >
          <TbLetterX
            className="font-bold text-[42px] place-self-center"
            aria-hidden
          />
        </button>
        <div className="absolute top-13 h-full w-full">
          <div className="flex flex-col">
            <label className=" ml-3 font-bold" htmlFor="search">
              Finding Movies/TV shows
            </label>
            <input
              type="text"
              id="search"
              ref={inputRef}
              value={query}
              className="p-0.5 rounded-sm w-[90%] place-self-center mt-1 text-dark bg-light  tablet:mt-3 tablet:w-60 tablet:ml-6 tablet:p-1 tablet:place-self-start"
              placeholder="Type to search..."
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex mt-2 justify-center tablet:mt-4" role="tablist">
            <button
              className={`w-10 h-fit py-1 px-2 rounded-l-md font-bold text-light ${isMovie ? "bg-cta" : "bg-cta-secondary"}`}
              onClick={() => setIsMovie(true)}
              role="tab"
            >
              Movie
            </button>
            <button
              className={`w-10 h-fit py-1 px-2 rounded-r-md font-bold text-light ${!isMovie ? "bg-cta" : "bg-cta-secondary"}`}
              onClick={() => setIsMovie(false)}
              role="tab"
            >
              TV
            </button>
          </div>
          <div className="w-full my-5 overflow-x-hidden">
            {isLoading && query.length > 0 && (
              <div className="pt-10 justify-self-center">
                <PageLoader defaultColor="text-light!" />
              </div>
            )}

            {/* Render results as soon as they exist */}
            <ul className="my-5 grid gap-2 grid-cols-[repeat(auto-fill,minmax(260px,1fr))] place-items-center w-full desktop:gap-y-5 tablet:gap-5 tablet:px-8">
              {normalized.map((item) => (
                <li key={item.id}>
                  <Suspense fallback={<LoaderCardPoster />}>
                    <QueryCard item={item} isMovie={isMovie} />
                  </Suspense>
                </li>
              ))}
            </ul>
            {error && <p className="text-center mt-10">An error has occured</p>}
            {/* Only show empty state if not loading and query exists */}
            {!isLoading && query.length > 0 && normalized.length === 0 && (
              <p className="text-center mt-10">
                No results found for &quot;{query}&quot;
              </p>
            )}
          </div>
        </div>
      </motion.dialog>
    </>
  );
}

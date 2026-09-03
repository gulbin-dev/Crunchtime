"use client";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";
import { MediaTypes } from "@utils/types";
import { fetcher } from "@utils/swr/fetcher";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import QueryCard from "@//components/QueryCard";

function CardList({
  catalog,
  filteredGenre,
}: {
  catalog: string;
  filteredGenre?: string;
}) {
  const { data, error, isLoading, isValidating } = useSWR<MediaTypes>(
    `/api/catalog?mediaType=${catalog}&genre=${filteredGenre || ""}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    },
  );

  return isLoading || isValidating ? (
    // pending
    Array.from({ length: 10 }, (_, index) => (
      <li key={index}>
        <LoaderCardPoster />
      </li>
    ))
  ) : !data ? (
    // failed
    <li>
      <p>{error}</p>
    </li>
  ) : (
    // success
    data.slice(0, 10).map((item) => {
      return (
        <li
          key={item.id}
          className="card-fade-in relative h-35 min-w-20 rounded-xl"
        >
          <QueryCard item={item} catalog={catalog} />
        </li>
      );
    })
  );
}

export default memo(CardList);

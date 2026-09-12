"use client";
import { memo } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import QueryCard from "@components/QueryCard";
import { MediaTypes, FetchResponse } from "@utils/types";
import { fetcher } from "@utils/swr/fetcher";
import { SadIcon } from "@utils/tabler-icons";
import { normalizeData } from "@utils/normalizeData";

function QueryList({
  catalog,
  debouncedValue,
}: {
  catalog: string;
  debouncedValue: string;
}) {
  const { data, isLoading, isValidating, error } = useSWR<
    FetchResponse<MediaTypes>
  >(
    debouncedValue
      ? `/api/search?query=${encodeURIComponent(debouncedValue)}&media=${catalog}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      dedupingInterval: 60000,
    },
  );

  const normalized = data ? normalizeData(data.results) : [];

  return isLoading || isValidating ? (
    // pending
    Array.from({ length: 10 }, (_, index) => (
      <li key={index}>
        <LoaderCardPoster />
      </li>
    ))
  ) : error ? (
    // failed
    <ErrorState />
  ) : debouncedValue.length > 0 && normalized.length === 0 ? (
    <EmptyState query={debouncedValue} />
  ) : (
    // success
    normalized.slice(0, 10).map((item) => {
      return (
        <li
          key={item.id}
          className="card-fade-in tablet:min-w-20 relative min-w-15 rounded-xl"
        >
          <QueryCard item={item} catalog={catalog} />
        </li>
      );
    })
  );
}

export default memo(QueryList);

const EmptyState = memo(function EmptyState({ query }: { query: string }) {
  return (
    <div className="animate-fade-in-up mt-6 flex flex-col items-center justify-center gap-2 text-center">
      <div className="bg-cta/10 text-cta flex h-14 w-14 items-center justify-center rounded-full">
        <SadIcon size={28} />
      </div>
      <p className="text-foreground-primary text-sm font-semibold">
        No results found
      </p>
      <p className="text-foreground-primary/60 text-xs">
        Nothing matched &quot;
        <span className="text-foreground-primary font-semibold">{query}</span>
        &quot;. Try a different keyword.
      </p>
    </div>
  );
});

const ErrorState = () => (
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
);

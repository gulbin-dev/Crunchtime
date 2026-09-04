"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import Link from "next/link";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";
import useFetchPreviewData from "@hooks/useFetchPreviewData";
import { FetchResponse, Review } from "@utils/types";
import { avatarPathChecker } from "@utils/avatarPathChecker";
import { fetcher } from "@utils/swr/fetcher";
import AvatarPlaceholder from "./UI/AvatarPlaceholder";

export default function ReviewComponent({ reviewID }: { reviewID?: string }) {
  const { params } = useFetchPreviewData();
  const [pageIndex, setPageIndex] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [hasMorePages, setHasMorePages] = useState(true);
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map()); // Explicitly typing the Map to handle HTMLDivElement
  const [isClampedMap, setIsClampedMap] = useState<Record<string, boolean>>({});
  const { displayedItems, sentinelRef, hasMore } = useInfiniteScroll(
    allReviews.filter((item) => item.id !== (reviewID || "")),
    { itemsPerPage: 5 },
  );
  const { data } = useSWR(
    hasMorePages
      ? `/preview/${params.media}/${params.id}/api/review?media=${params.media}&id=${params.id}&page=${pageIndex}`
      : null,
    (url) => fetcher<FetchResponse<Review[]>>(url),
    {
      suspense: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  // Accumulate reviews from all pages - using render-time state update
  if (data?.results) {
    const newReviews = data.results.filter(
      (item) => !allReviews.some((existing) => existing.id === item.id),
    );
    if (newReviews.length > 0) {
      setAllReviews((prev) => [...prev, ...newReviews]);
    }

    // Check if there are more pages
    const totalPages = data.total_pages || 1;
    if (pageIndex >= totalPages && hasMorePages) {
      setHasMorePages(false);
    }
  }

  useEffect(() => {
    const observers: ResizeObserver[] = [];
    const currentRefs = containerRefs.current;

    // Loop through all active refs in the map
    currentRefs.forEach((el, itemId) => {
      const textElement = el.querySelector("q");
      if (!textElement) return;

      const checkTruncation = () => {
        const isTruncated = textElement.scrollHeight > textElement.clientHeight;

        setIsClampedMap((prev) => {
          if (prev[itemId] === isTruncated) return prev;
          return { ...prev, [itemId]: isTruncated };
        });
      };

      const resizeObserver = new ResizeObserver(() => checkTruncation());
      resizeObserver.observe(textElement);
      observers.push(resizeObserver);

      // Run initial layout check
      checkTruncation();
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [allReviews]);

  // Load next page when sentinel is visible and there are more pages
  useEffect(() => {
    if (hasMore && hasMorePages && displayedItems.length >= allReviews.length) {
      // We've displayed all current reviews, load next page
      const timer = requestAnimationFrame(() => {
        setPageIndex((prev) => prev + 1);
      });
      return () => cancelAnimationFrame(timer);
    }
  }, [hasMore, hasMorePages, displayedItems.length, allReviews.length]);

  return (
    <>
      <ul className="grid list-none gap-4">
        {displayedItems.map((item) => {
          const isUpdated = item.updated_at
            ? item.updated_at.length > 0
            : false;
          const checkerResult = avatarPathChecker(
            item.author_details.avatar_path,
          );

          const createdDate = new Date(item.created_at).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          );
          const updateDate = new Date(item.updated_at || "").toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          );

          return (
            <li
              key={item.id}
              className="border-secondary/15 desktop:rounded-[28px] overflow-hidden rounded-none border shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_-38px_rgba(0,165,249,0.18)]"
            >
              <div className="flex flex-col gap-4 p-3">
                <Link
                  href={`/preview/${params.media}/${params.id}/review/${item.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 ring-secondary/20 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full ring-1">
                      {checkerResult ? (
                        <Image
                          src={checkerResult}
                          alt={item.author || "Reviewer avatar"}
                          width={56}
                          height={56}
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <AvatarPlaceholder />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-cta truncate text-base font-semibold transition-colors duration-200 group-hover:underline">
                        {item.author}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-secondary bg-secondary/10 rounded-full px-2 py-1">
                          {item.author_details.rating !== null
                            ? item.author_details.rating
                            : "No rating"}
                        </span>
                        <span>{isUpdated ? updateDate : createdDate}</span>
                        {isUpdated && (
                          <span className="bg-secondary/15 text-secondary rounded-full px-2 py-1">
                            Updated
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>

                <div
                  className="border-secondary/15 bg-secondary/5 rounded-3xl border p-4 text-sm leading-4"
                  data-id={item.id}
                  ref={(el) => {
                    if (el) containerRefs.current.set(item.id, el);
                    else containerRefs.current.delete(item.id);
                  }}
                >
                  <q className="line-clamp-5 italic">{item.content}</q>

                  {isClampedMap[item.id] && (
                    <Link
                      href={`/preview/${params.media}/${params.id}/review/${item.id}`}
                      className="bg-secondary hover:bg-secondary/90 mt-4 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition"
                    >
                      Read more
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}

        {displayedItems.length === 0 && (
          <li className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm">
            No reviews found.
          </li>
        )}
      </ul>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="mt-8 flex justify-center py-4"
          role="status"
          aria-label="Loading more reviews"
        >
          <div className="inline-flex gap-2">
            <div className="bg-secondary h-2 w-2 animate-bounce rounded-full"></div>
            <div className="bg-secondary animation-delay-100 h-2 w-2 animate-bounce rounded-full"></div>
            <div className="bg-secondary animation-delay-200 h-2 w-2 animate-bounce rounded-full"></div>
          </div>
        </div>
      )}
    </>
  );
}

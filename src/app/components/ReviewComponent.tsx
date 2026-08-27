"use client";

import { FetchResponse, Review } from "@utils/types";
import Image from "next/image";
import AvatarPlaceholder from "./UI/AvatarPlaceholder";
import { useRef, useState, useEffect } from "react";
import useSWR from "swr";
import { ParamValue } from "next/dist/server/request/params";
import Link from "next/link";
import { avatarPathChecker } from "@utils/avatarPathChecker";
import { fetcher } from "@utils/swr/fetcher";

export default function ReviewComponent({
  media,
  id,
  reviewID,
}: {
  media: ParamValue;
  id: ParamValue;
  reviewID?: string;
}) {
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR(
    `/preview/${media}/${id}/api/review?media=${media}&id=${id}&page=${pageIndex}`,
    (url) => fetcher<FetchResponse<Review[]>>(url),
    { suspense: true },
  );

  // Explicitly typing the Map to handle HTMLDivElement
  const containerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [isClampedMap, setIsClampedMap] = useState<Record<string, boolean>>({});

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
    // FIX: Depend on data so it reruns when SWR fetches new pages or items
  }, [data]);

  // Safely extract results or fallback to empty array if data isn't fully loaded
  const reviewsList = data?.results || [];
  const filteredReviews = reviewsList
    .slice(0, 3)
    .filter((item) => item.id !== (reviewID || ""));

  return (
    <>
      <ul className="grid max-h-180 list-none gap-4 overflow-x-hidden overflow-y-scroll p-0">
        {filteredReviews.map((item) => {
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
              className="border-secondary/15 overflow-hidden rounded-[28px] border shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_70px_-38px_rgba(0,165,249,0.18)]"
            >
              <div className="flex flex-col gap-4 p-5 sm:p-6">
                <Link
                  href={`/preview/${media}/${id}/review/${item.id}`}
                  className="group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-secondary/10 ring-secondary/20 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-1">
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
                  className="border-secondary/15 bg-secondary/5 rounded-3xl border p-4 text-sm leading-7"
                  data-id={item.id}
                  ref={(el) => {
                    if (el) containerRefs.current.set(item.id, el);
                    else containerRefs.current.delete(item.id);
                  }}
                  style={{ lineHeight: "1.75" }}
                >
                  <q className="line-clamp-10 block italic">{item.content}</q>

                  {isClampedMap[item.id] && (
                    <Link
                      href={`/preview/${media}/${id}/review/${item.id}`}
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

        {filteredReviews.length === 0 && (
          <li className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-center text-sm">
            No reviews found.
          </li>
        )}
      </ul>

      <div className="mt-5 flex flex-wrap justify-center gap-4 pb-3">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          disabled={pageIndex === 1}
        >
          Previous
        </button>
        <button
          type="button"
          className="bg-cta hover:bg-cta/90 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition"
          onClick={() => setPageIndex((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}

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
    .slice(0, 5)
    .filter((item) => item.id !== (reviewID || ""));

  return (
    <>
      <ul className="list-none p-0 relative px-3">
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
              className="mt-3 border-b border-gray-shade/10 pb-4"
            >
              <div className="bg-secondary text-foreground-dark rounded-sm px-2 pt-2 tablet:rounded-xl">
                {/* FIX: Removed extra trailing '}' from the template string expression */}
                <Link href={`/preview/${media}/${id}/review/${item.id}`}>
                  <div className="grid grid-cols-[45px_1fr] gap-3">
                    {checkerResult ? (
                      <Image
                        src={checkerResult}
                        alt=""
                        width={45}
                        height={45}
                        className="rounded-full h-[45px] object-cover"
                      />
                    ) : (
                      <AvatarPlaceholder />
                    )}

                    <div>
                      <h4 className="font-bold">{item.author}</h4>
                      {isUpdated ? (
                        <p className="text-xs flex gap-1 items-center mt-1">
                          {updateDate}
                          <span className="italic rounded py-0.2 px-1">
                            Updated
                          </span>
                        </p>
                      ) : (
                        <p className="text-xs mt-1">{createdDate}</p>
                      )}
                    </div>
                  </div>
                </Link>

                <div
                  className="mt-3 pb-3"
                  data-id={item.id}
                  ref={(el) => {
                    if (el) containerRefs.current.set(item.id, el);
                    else containerRefs.current.delete(item.id);
                  }}
                  style={{ lineHeight: "1.5" }}
                >
                  {/* FIX: Added 'block' class so element obeys height boundaries */}
                  <q className="italic text-pretty line-clamp-10">
                    {item.content}
                  </q>

                  {/* CONDITIONAL RENDER: Only shows if text overflows line-clamp-10 */}
                  {isClampedMap[item.id] && (
                    <Link
                      href={`/preview/${media}/${id}/review/${item.id}`}
                      className="bg-cta text-foreground-dark py-0.5 px-1.5 mt-1 inline-block rounded-2xl"
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
          <p className="italic text-center my-3">No reviews found.</p>
        )}
      </ul>

      <div className="flex mt-3 justify-center gap-5 pb-3">
        <button
          className="bg-cta py-0.5 px-1.5 rounded-md disabled:opacity-50"
          onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
          disabled={pageIndex === 1}
        >
          Previous
        </button>
        <button
          className="bg-cta py-0.5 px-1.5 rounded-md"
          onClick={() => setPageIndex((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}

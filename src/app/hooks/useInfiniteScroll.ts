import { useEffect, useRef, useState, type RefObject } from "react";

interface UseInfiniteScrollOptions<
  TSentinel extends HTMLElement = HTMLElement,
> {
  itemsPerPage?: number;
  threshold?: string;
  rootRef?: RefObject<HTMLElement | null>;
  sentinelRef?: RefObject<TSentinel | null>;
}

// Notice the explicit default type assignment TSentinel = HTMLElement
export function useInfiniteScroll<
  T,
  TSentinel extends HTMLElement = HTMLElement,
>(allItems: T[], options: UseInfiniteScrollOptions<TSentinel> = {}) {
  const {
    itemsPerPage = 5,
    threshold = "0px 0px -100px 0px",
    rootRef,
    sentinelRef: customSentinelRef,
  } = options;

  const [displayedCount, setDisplayedCount] = useState(() =>
    Math.min(itemsPerPage, allItems.length),
  );

  // Use the generic TSentinel type here to match whatever element type is required
  const internalSentinelRef = useRef<TSentinel | null>(null);
  const activeSentinelRef = customSentinelRef || internalSentinelRef;

  const prevItemsLengthRef = useRef(allItems.length);

  useEffect(() => {
    if (allItems.length !== prevItemsLengthRef.current) {
      if (
        allItems.length === 0 ||
        allItems.length < prevItemsLengthRef.current
      ) {
        const handleStateUpdate = () =>
          setDisplayedCount(Math.min(itemsPerPage, allItems.length));

        handleStateUpdate();
      }
      prevItemsLengthRef.current = allItems.length;
    }
  }, [allItems.length, itemsPerPage]);

  useEffect(() => {
    const sentinel = activeSentinelRef.current;
    if (!sentinel || allItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDisplayedCount((prev) =>
              Math.min(prev + itemsPerPage, allItems.length),
            );
          }
        });
      },
      {
        root: rootRef?.current ?? null,
        rootMargin: threshold,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [allItems.length, itemsPerPage, threshold, rootRef, activeSentinelRef]);

  const displayedItems = allItems.slice(0, displayedCount);
  const hasMore = displayedCount < allItems.length;

  return {
    displayedItems,
    // TypeScript will now correctly evaluate the concrete type here
    sentinelRef: activeSentinelRef,
    hasMore,
    displayedCount,
  };
}

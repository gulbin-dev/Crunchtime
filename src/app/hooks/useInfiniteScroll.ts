import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollOptions {
  itemsPerPage?: number;
  threshold?: string;
}

export function useInfiniteScroll<T>(
  allItems: T[],
  options: UseInfiniteScrollOptions = {},
) {
  const { itemsPerPage = 5, threshold = "0px 0px -100px 0px" } = options;

  // Use allItems as part of initial state to reset when data changes
  const [displayedCount, setDisplayedCount] = useState(() => itemsPerPage);
  const [prevItemsLength, setPrevItemsLength] = useState(allItems.length);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // When allItems changes, reset the displayed count
  if (
    allItems.length !== prevItemsLength &&
    allItems.length < prevItemsLength
  ) {
    setDisplayedCount(itemsPerPage);
    setPrevItemsLength(allItems.length);
  }

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

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
      { rootMargin: threshold },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [itemsPerPage, threshold, allItems.length]);

  const displayedItems = allItems.slice(0, displayedCount);
  const hasMore = displayedCount < allItems.length;

  return {
    displayedItems,
    sentinelRef,
    hasMore,
    displayedCount,
  };
}

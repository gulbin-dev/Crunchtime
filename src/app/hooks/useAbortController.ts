import { useEffect, useRef } from "react";

/**
 * Custom hook to manage AbortController lifecycle.
 * Automatically creates a new AbortController and cleans it up on unmount or dependency changes.
 * This is useful for cancelling fetch requests when a component unmounts or dependencies change.
 *
 * @param dependencies - Optional array of dependencies. When these change, a new AbortController is created.
 * @returns The AbortSignal to pass to fetch requests
 *
 * @example
 * const signal = useAbortController([mediaId]);
 * const { data } = useSWR(key, (url) => fetcher(url, signal));
 */
export function useAbortController(
  dependencies?: React.DependencyList,
): AbortSignal {
  // Initialize with a default AbortController to avoid accessing ref during render
  const abortControllerRef = useRef<AbortController>(new AbortController());

  useEffect(() => {
    // Create a new AbortController on mount or when dependencies change
    abortControllerRef.current = new AbortController();

    return () => {
      // Abort any pending requests when component unmounts or dependencies change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return abortControllerRef.current.signal;
}

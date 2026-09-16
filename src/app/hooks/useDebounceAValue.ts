import { useState, useRef, useEffect } from "react";

/**
 * Custom debouncer use to prevent `uneccessary re-render`
 * @param value any value `type` use to debounce
 * @param delay delay timer in `milliseconds`
 * @returns an array of `debounced value` and a `pending state`
 */
export default function useDebounceAValue<T>(
  value: T,
  delay: number = 200,
): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isOnTimeout, setIsOnTimeout] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      const handleStateUpdate = () => setIsOnTimeout(true);
      handleStateUpdate();
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsOnTimeout(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        setIsOnTimeout(false);
      }
    };
  }, [value, delay]);

  return [debouncedValue, isOnTimeout];
}

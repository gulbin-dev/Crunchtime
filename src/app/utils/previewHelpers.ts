/**
 *  Helper functions for `preview/page.tsx` route
 *
 * @param `value` is a value of `Movie` duration time in minutes
 * @returns a string value to display in the UI
 */
export function handleRuntime(value: number | undefined) {
  if (value === undefined || value <= 0) return null;

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  const hoursString = hours > 0 ? `${hours}hour${hours > 1 ? "s" : ""}` : "";

  const minutesString =
    minutes > 0 ? `${minutes}min${minutes > 1 ? "s" : ""}` : "";

  return `${hoursString} ${minutesString}`.trim();
}

/**
 *  Helper functions for `preview/page.tsx` route
 *
 * @param `value` is a value of `Movie` duration time
 * @returns a string value to display in the UI
 */
export function handleRuntime(value: number | undefined) {
  if (value === undefined) return null;
  const hours = Number((value / 60).toFixed(0));
  const minutes = getFractionalPart(hours);
  return `${hours}hour${hours > 1 ? "s" : ""} ${minutes > 1 ? `${minutes}mins` : minutes === 1 ? `${minutes}min` : ""}`;
}

/**
 *  To extract the fraction values of variable `hours`
 * @param num is a value of `hours` variable
 * @returns fraction value
 */
function getFractionalPart(num: number) {
  const integerPart = Math.trunc(num);
  const fractionalPart = num - integerPart;
  return fractionalPart;
}

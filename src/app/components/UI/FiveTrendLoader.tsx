import Skeleton from "react-loading-skeleton";

export default function FiveTrendLoader() {
  return (
    <Skeleton
      width="100%"
      height="100%"
      className="absolute inset-0 -top-5 left-0"
      aria-hidden
    />
  );
}

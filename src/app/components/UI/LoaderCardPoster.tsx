import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function LoaderCardPoster() {
  return (
    <div className="z-10 w-full">
      <Skeleton width="160px" height="187px" />
      <Skeleton width="140px" style={{ margin: "14px 0 0 0" }} />
    </div>
  );
}

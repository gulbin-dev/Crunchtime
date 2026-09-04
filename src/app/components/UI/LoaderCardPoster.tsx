import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default function LoaderCardPoster() {
  return (
    <div className="card-fade-in z-10 w-full">
      <Skeleton width="160px" height="200px" />
    </div>
  );
}

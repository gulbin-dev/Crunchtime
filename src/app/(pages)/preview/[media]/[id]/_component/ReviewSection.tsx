import { Suspense, memo } from "react";
import PageLoader from "@components/UI/PageLoader";
import ReviewComponent from "@components/ReviewComponent";

const ReviewSection = memo(function ReviewSection() {
  return (
    <section
      className="panel--section__toggle desktop:col-end-8 desktop:-mt-50 desktop:bg-transparent desktop:border-none desktop:shadow-none inset-0 col-start-1 row-start-1 grid items-start overflow-hidden rounded-xl"
      data-view="review"
    >
      <div className="mt-5 flex flex-col gap-3 px-3">
        <div className="flex justify-between">
          {" "}
          <h2 className="text-heading-lg font-semibold">Reviews</h2>{" "}
        </div>

        <p className="text-sm">
          Read the latest community reactions and expert thoughts.
        </p>
      </div>
      <div className="mt-4">
        <Suspense
          fallback={
            <div className="flex w-full place-content-center py-8">
              <PageLoader />
            </div>
          }
        >
          <ReviewComponent />
        </Suspense>
      </div>
    </section>
  );
});
export default ReviewSection;

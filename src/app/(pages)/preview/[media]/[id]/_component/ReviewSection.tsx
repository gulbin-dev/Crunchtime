import { Suspense } from "react";
import PageLoader from "@components/UI/PageLoader";
import ReviewComponent from "@components/ReviewComponent";

type ClientReviewSectionProps = {
  isVisible: boolean;
};

export default function ReviewSection({ isVisible }: ClientReviewSectionProps) {
  return (
    <section
      className={`${isVisible ? "block" : "hidden"} desktop:block desktop:col-end-8 desktop:row-span-100 relative col-start-1 row-start-2`}
    >
      <div className="review_container desktop:bg-transparent desktop:border-none desktop:shadow-none overflow-hidden rounded-xl">
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
      </div>
    </section>
  );
}

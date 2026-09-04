"use client";
import { redirect, RedirectType, useParams } from "next/navigation";
import useSWR from "swr";
import PageWrapper from "@pages/PageWrapper";
import LineBreak from "@components/UI/LineBreak";
import MediaBanner from "@components/MediaBanner";
import PageLoader from "@components/UI/PageLoader";
import ReviewComponent from "@components/ReviewComponent";
import { fetcher } from "@utils/swr/fetcher";
import { FetchResponse, Review } from "@utils/types";
import { BackIcon } from "@utils/tabler-icons";

export default function ReviewPage() {
  const params = useParams();
  const { data } = useSWR(
    `/preview/${params.media}/${params.id}/review/${params.reviewId}/api/review?media=${params.media}&id=${params.id}`,
    (url) => fetcher<FetchResponse<Review[]>>(url),
  );
  if (!data)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <PageLoader />
      </div>
    );
  const review = data.results.filter((item) => item.id === params.reviewId);
  const isUpdated = review[0].updated_at
    ? review[0].updated_at.length > 0
    : false;

  const createdDate = new Date(review[0].created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const updateDate = new Date(
    isUpdated ? review[0].updated_at : "",
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <PageWrapper>
      <div className="w-full max-w-180 place-self-center">
        <button
          className="bg-cta ml-3 rounded-full p-1"
          onClick={() =>
            redirect(
              `/preview/${params.media}/${params.id}`,
              RedirectType.replace,
            )
          }
        >
          <BackIcon className="text-2xl" />
        </button>
        <MediaBanner />
        <div className="mt-2 flex h-fit flex-col gap-2 p-1 px-3">
          <h1>
            Review by <em>{review[0].author}</em>
          </h1>
          {isUpdated ? (
            <p className="flex items-center gap-1 text-xs">
              <span className="bg-gray-shade rounded p-0.5 italic">
                Updated
              </span>
              {updateDate}
            </p>
          ) : (
            <p className="text-xs">{createdDate}</p>
          )}

          <q className="block leading-relaxed text-pretty">
            {review[0].content}
          </q>
        </div>
        <LineBreak />
        <div>
          <h2 className="text-heading-md tablet:mt-3 ml-3">Other reviews</h2>

          <ReviewComponent
            reviewID={params.reviewId?.slice(0, -3).toString()}
          />
        </div>
      </div>
    </PageWrapper>
  );
}

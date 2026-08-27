"use client";
import { useParams } from "next/navigation";
import { useState, Suspense } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import MediaBanner from "@components/MediaBanner";
import LoaderCardPoster from "@components/UI/LoaderCardPoster";
import FailedDataDialog from "@components/UI/Error/FailedDataDialog";
import PageLoader from "@components/UI/PageLoader";
import ReviewComponent from "@components/ReviewComponent";
import PageWrapper from "@pages/PageWrapper";
import {
  Cast,
  Crew,
  Similar,
  Recommendation,
} from "./_component/PreviewComponents";
import usePreview from "@hooks/usePreviewDetails";
import { normalizePreviewData } from "@utils/normalizeData";

export default function PreviewPage() {
  const [isSimilar, setIsSimilar] = useState<boolean>(true);
  const params = useParams();
  const { data, error, isLoading } = usePreview(params.media, params.id, {
    suspense: true,
  });

  if (error) {
    return <FailedDataDialog error={error} />;
  }

  if (isLoading || !data) {
    return (
      <div className="bg-primary flex min-h-screen w-full items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  const normalize = normalizePreviewData(data);
  const videoTrailer =
    normalize.videos?.results.find((v) => v.type === "Trailer") ?? null;
  return (
    <PageWrapper className="tablet:gap-x-8 tablet:px-4 desktop:px-6 tablet:pb-8 desktop:grid-cols-12 tablet:grid-cols-8 desktop:grid mx-auto flex w-full grid-flow-row grid-cols-4 flex-col pt-4">
      {/* Video Section */}
      <section className="desktop:col-end-8 col-span-full col-start-1 row-span-3 row-start-1">
        <div className="tablet:rounded-lg relative aspect-video overflow-hidden">
          <Suspense fallback={<LoaderCardPoster />}>
            {videoTrailer ? (
              <LiteYouTubeEmbed
                id={`${videoTrailer.key}`}
                iframeClass="iframe-video"
                title="Youtube video player"
                lazyLoad
                poster="maxresdefault"
                enableJsApi
                focusOnLoad
                autoplay
                seo={{
                  name: `${videoTrailer.name}`,
                  description: `Official video trailer of ${normalize.normalized?.normalizeTitle}`,
                }}
              />
            ) : (
              <div className="flex h-full w-1/2 items-center justify-center px-6 py-24 text-center text-sm text-white/80">
                Trailer unavailable
              </div>
            )}
          </Suspense>
        </div>
      </section>
      {/* Details Section */}
      <section className="tablet:rounded-lg desktop:row-start-1 desktop:col-start-8 desktop:col-end-13 tablet:max-h-50 desktop:max-h-none desktop:border bg-secondary/10 border-secondary/60 desktop:rounded-4xl col-span-full row-span-4 row-start-4 overflow-hidden p-4 shadow-2xl backdrop-blur-xl">
        <Suspense fallback={<LoaderCardPoster />}>
          <MediaBanner />
        </Suspense>
        <h2 className="text-heading-xl text-secondary mt-5 font-semibold">
          Overview
        </h2>
        <p className="mt-3 text-sm leading-4 sm:text-base">
          {normalize.overview}
        </p>

        <h3 className="text-heading-lg pt-5">Casts</h3>
        <ul className="flex w-full min-w-0 gap-2 overflow-x-auto overflow-y-hidden">
          <Suspense fallback={<LoaderCardPoster />}>
            <Cast />
          </Suspense>
        </ul>

        <h3 className="text-heading-lg pt-5">Crew</h3>
        <ul className="flex w-full min-w-0 gap-2 overflow-x-auto overflow-y-hidden">
          <Suspense fallback={<LoaderCardPoster />}>
            <Crew />
          </Suspense>
        </ul>
      </section>
      {/* Reviews Section */}
      <section className="desktop:col-end-8 col-start-1 row-span-4 row-start-4">
        <div className="bg-surface-elevated/90 desktop:bg-transparent border-secondary/15 desktop:border-none desktop:shadow-none desktop:drop-blur-none rounded-xl border p-5 shadow-2xl backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-heading-lg font-semibold">Reviews</h2>
              <p className="text-sm">
                Read the latest community reactions and expert thoughts.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Suspense
              fallback={
                <div className="flex w-full place-content-center py-8">
                  <PageLoader />
                </div>
              }
            >
              <ReviewComponent media={params.media} id={params.id} />
            </Suspense>
          </div>
        </div>
      </section>
      {/* Similar and Recommendation Section */}
      <section className="desktop:col-start-8 desktop:col-end-13 col-span-full row-span-2 row-start-6 mt-8">
        <ul className="flex gap-2 pb-2">
          <li>
            <button
              className={`${isSimilar ? "bg-cta" : "bg-cta-secondary"} rounded-full px-3 py-1.5 text-white`}
              onClick={() => setIsSimilar(true)}
            >
              Similar
            </button>
          </li>
          <li>
            <button
              className={`${!isSimilar ? "bg-cta" : "bg-cta-secondary"} rounded-full px-3 py-1.5 text-white`}
              onClick={() => setIsSimilar(false)}
            >
              Recommendations
            </button>
          </li>
        </ul>
        <ul className="grid max-h-148 grid-cols-[repeat(auto-fit,minmax(250px,1fr))] justify-center gap-1.5 overflow-x-hidden overflow-y-scroll">
          <Suspense fallback={<LoaderCardPoster />}>
            {isSimilar ? <Similar /> : <Recommendation />}
          </Suspense>
        </ul>
      </section>
    </PageWrapper>
  );
}

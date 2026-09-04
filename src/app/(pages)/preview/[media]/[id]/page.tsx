import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PageWrapper from "@pages/PageWrapper";
import ClientDetailsSection from "./_component/ClientDetailsSection";
import PreviewClientComponent from "./_component/PreviewClientComponent";
import { YoutubeVideo } from "./_component/DataDependentComponents";

export default function PreviewPage() {
  return (
    <PageWrapper className="tablet:gap-x-8 tablet:px-4 desktop:px-6 tablet:pb-8 desktop:grid-cols-12 desktop:grid-flow-row desktop:auto-rows-min mx-auto grid auto-rows-auto grid-cols-1 pt-4">
      {/* Video Section */}
      <section className="desktop:col-end-8 desktop:row-span-3 col-start-1 row-start-1">
        <Suspense
          fallback={
            <div className="card-fade-in z-10">
              <Skeleton width="full" height="full" className="aspect-video" />
            </div>
          }
        >
          <YoutubeVideo />
        </Suspense>
      </section>
      {/* Details Section */}
      <ClientDetailsSection />

      <PreviewClientComponent />
    </PageWrapper>
  );
}

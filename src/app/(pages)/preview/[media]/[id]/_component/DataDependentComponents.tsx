"use client";

/**
 * Separating a data dependent components is neccessary to achive modern loading page look
 */
import Image from "next/image";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import CardPosterImagePlaceholder from "@components/UI/CardPosterImagePlaceholder";
import QueryCard from "@components/QueryCard";
import NothingToShow from "@components/UI/Error/NothingToShow";
import { useInfiniteScroll } from "@hooks/useInfiniteScroll";
import useFetchPreviewData from "@hooks/useFetchPreviewData";
import { LoaderIcon } from "@utils/tabler-icons";
import { normalizeData } from "@utils/normalizeData";

export function YoutubeVideo() {
  const { videoTrailer, normalize, isLoading, isValidating } =
    useFetchPreviewData();
  return (
    <div className="tablet:rounded-lg relative aspect-video overflow-hidden">
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
            description: `Official video trailer of ${normalize?.normalized?.normalizeTitle ?? ""}`,
          }}
        />
      ) : isLoading || isValidating ? (
        <div className="bg-primary-shade dark:bg-dark-shade flex h-full items-center justify-center px-6 py-24 text-center text-sm text-white/80 transition-colors duration-300">
          <span className="text-foreground-primary flex gap-1">
            <span className="animate-loader-icon-spin">
              <LoaderIcon />
            </span>
            Loading Video
          </span>
        </div>
      ) : (
        <div className="bg-primary-shade dark:bg-dark-shade flex h-full items-center justify-center px-6 py-24 text-center text-sm text-white/80 transition-colors duration-300">
          <span className="text-foreground-primary">Trailer unavailable</span>
        </div>
      )}
    </div>
  );
}
export function Overview() {
  const { normalize } = useFetchPreviewData();
  return (
    <p className="mt-3 text-sm leading-4">
      {normalize?.overview ?? "Now available right now"}
    </p>
  );
}
export function Cast() {
  const { normalize } = useFetchPreviewData();
  return (
    normalize?.credits?.cast?.map((cast) => (
      <li
        key={cast.id}
        className="relative flex w-40 shrink-0 items-center gap-2 py-2"
      >
        {cast.profile_path === null ? (
          <div className="h-18.75 w-12.5 shrink-0">
            <CardPosterImagePlaceholder />
          </div>
        ) : (
          <div className="relative h-20 w-15">
            <Image
              src={`https://image.tmdb.org/t/p/w185/${cast.profile_path}`}
              alt={cast.name}
              fill

              decoding="async"
              sizes="(max-width: 640px) 45vw, 20vw"
              className="absolute aspect-9/16 object-cover"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold wrap-break-word">{cast.name}</span>
          <span className="wrap-break-word">{cast.character}</span>
        </div>
      </li>
    )) ?? "Now available right now"
  );
}

export function Crew() {
  const { normalize } = useFetchPreviewData();
  return (
    normalize?.credits?.crew?.map((crew) => (
      <li key={crew.credit_id} className="flex w-40 items-center gap-2 py-2">
        {crew.profile_path === null ? (
          <div className="h-18.75 w-12.5 shrink-0">
            <CardPosterImagePlaceholder />
          </div>
        ) : (
          <div className="relative h-20 w-15">
            <Image
              src={`https://image.tmdb.org/t/p/w185/${crew.profile_path}`}
              alt={crew.name}
              fill

              decoding="async"
              sizes="(max-width: 640px) 45vw, 20vw"
              className="absolute aspect-9/16 object-cover"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="font-semibold wrap-break-word">{crew.name}</span>
          <span className="wrap-break-word">{crew.known_for_department}</span>
        </div>
      </li>
    )) ?? "Now available right now"
  );
}

export function Similar() {
  const { data } = useFetchPreviewData();
  const allSimilarItems = data ? normalizeData(data.similar.results) : [];
  const { displayedItems, sentinelRef, hasMore } = useInfiniteScroll(
    allSimilarItems,
    { itemsPerPage: 5 },
  );
  return (
    <>
      {displayedItems.length === 0 ? (
        <NothingToShow />
      ) : (
        displayedItems.map((item) => {
          const catalog = "name" in item ? "tv" : "movie";
          return (
            <li
              key={item.id}
              className="flex w-20 shrink-0 items-center gap-2 py-2"
            >
              <QueryCard item={item} catalog={catalog} />
            </li>
          );
        })
      )}
      {hasMore && <div ref={sentinelRef} className="h-2 w-2" />}
    </>
  );
}

export function Recommendation() {
  const { data } = useFetchPreviewData();
  const allRecommendationItems = data
    ? normalizeData(data.recommendations.results)
    : [];
  const { displayedItems, sentinelRef, hasMore } = useInfiniteScroll(
    allRecommendationItems,
    { itemsPerPage: 5 },
  );
  return (
    <>
      {displayedItems.length === 0 ? (
        <NothingToShow />
      ) : (
        displayedItems.map((item) => {
          const catalog = "name" in item ? "tv" : "movie";
          return (
            <li
              key={item.id}
              className="flex w-20 shrink-0 items-center gap-2 py-2"
            >
              <QueryCard item={item} catalog={catalog} />
            </li>
          );
        })
      )}
      {hasMore && <div ref={sentinelRef} className="h-2 w-2" />}
    </>
  );
}

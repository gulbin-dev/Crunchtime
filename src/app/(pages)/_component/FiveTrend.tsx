"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import useGenres from "@hooks/useGenres";
import UI_Brick from "@components/UI/UI_Brick";
import { MediaTypes, Movie, TV } from "@utils/types";
import { RatingIcon } from "@utils/tabler-icons";
import aggregateGenre from "@utils/aggregateGenre";
import { gsap, useGSAP, Observer, mediaQueries } from "@utils/gsap";
import useSWR from "swr";
import { fetcher } from "@utils/swr/fetcher";
import ThumbnailCards from "./ThumbnailCards";

export default function FiveTrend() {
  const { data: popular } = useSWR<MediaTypes>("/api/popular", fetcher, {
    suspense: true,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const movieGenre = useGenres("movie");
  const tvGenre = useGenres("tv");
  const heroDivRef = useRef<HTMLDivElement | null>(null);
  const selectSlideRef = useRef<(index: number) => void>(() => {});
  const [selectedIndex, setSelectedIndex] = useState(0);
  useGSAP(
    () => {
      const trendingList = gsap.utils.toArray<HTMLDivElement>(".five-trend");

      if (trendingList.length === 0) return;

      let currentIndex = 0;
      let intervalId: NodeJS.Timeout | null = null;
      let isTweening = false; // Prevents continuous trigger flickers during touch holds
      const isDesktop = window.matchMedia(mediaQueries.isDesktop).matches;

      // Set initial positions
      gsap.set(trendingList, { xPercent: 100 });
      gsap.set(trendingList[0], { xPercent: 0 });

      const transitionTo = (nextIndex: number, direction: number) => {
        if (isTweening) return;

        // Prevent animating to the exact same slide
        if (nextIndex === currentIndex) return;

        isTweening = true; // Lock interactions during execution

        const currentSlide = trendingList[currentIndex];
        const nextSlide = trendingList[nextIndex];

        const currentEndMove = direction === 1 ? -100 : 100;
        const nextStartMove = direction === 1 ? 100 : -100;

        // Immediately update index before the animation fires
        currentIndex = nextIndex;
        setSelectedIndex(nextIndex);

        // Pre-position the incoming slide cleanly without triggering flash frames

        gsap.set(nextSlide, { xPercent: nextStartMove });

        // Use overwrite to kill conflicting animations on these elements cleanly
        gsap.to(currentSlide, {
          xPercent: currentEndMove,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: "auto",
        });

        gsap.to(nextSlide, {
          xPercent: 0,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            isTweening = false; // Release the interaction lock safely on completion
          },
        });
      };

      const playNext = (direction: number) => {
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = trendingList.length - 1;
        if (nextIndex >= trendingList.length) nextIndex = 0;

        transitionTo(nextIndex, direction);
      };

      selectSlideRef.current = (index) => {
        if (
          !isDesktop ||
          index === currentIndex ||
          index < 0 ||
          index >= trendingList.length
        ) {
          return;
        }

        transitionTo(index, index > currentIndex ? 1 : -1);
      };

      const startAutoplay = () => {
        intervalId = setInterval(() => {
          playNext(1);
        }, 5000);
      };

      const resetAutoplay = () => {
        if (intervalId) clearInterval(intervalId);
        startAutoplay();
      };

      const obs = !isDesktop
        ? Observer.create({
            target: heroDivRef.current,
            type: "touch,pointer",
            onLeft: () => {
              if (isTweening) return; // Prevent interval scrubbing during continuous touch hold
              playNext(1);
              resetAutoplay();
            },
            onRight: () => {
              if (isTweening) return;
              playNext(-1);
              resetAutoplay();
            },
            tolerance: 50, // Increased slightly to filter out micro-jitters from fingers
            preventDefault: false,
            lockAxis: true,
          })
        : null;

      if (!isDesktop) startAutoplay();

      return () => {
        if (intervalId) clearInterval(intervalId);
        obs?.kill();
        selectSlideRef.current = () => {};
      };
    },
    { scope: heroDivRef, dependencies: [popular] },
  );
  const genres = aggregateGenre(movieGenre.genres, tvGenre.genres);
  const normalize =
    popular && !Object.hasOwn(popular, "message")
      ? popular
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 5)
          .map((item) => {
            const medtype = item.media_type;
            const title =
              medtype === "movie" ? (item as Movie).title : (item as TV).name;
            const genreIds = item.genre_ids;
            const genreNames = genres
              .filter((item) => genreIds.includes(item.id))
              .map((item) => item.name);

            return { ...item, title, genreNames };
          })
      : [];
  return (
    <div ref={heroDivRef} className="text-foreground-light absolute inset-0">
      {normalize.map((item) => {
        return (
          <div
            key={item.id}
            className="five-trend absolute inset-0 top-0 left-0 flex h-full w-full"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              alt=""
              fill
              loading="eager"
              placeholder={item.blurDataUrl ? "blur" : "empty"}
              blurDataURL={item.blurDataUrl}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.7)_100%)]" />

            <div className="tablet:top-45 tablet:left-18 relative top-32 left-3 z-20 w-[90vw]">
              <div className="flex flex-col gap-2">
                <UI_Brick
                  value={item.media_type?.toUpperCase() || ""}
                  ariaLabel="media type"
                />
                <Link
                  href={`/preview/${item.media_type}/${item.id}`}
                  className="text-heading-lg underline underline-offset-8"
                >
                  {item.title}
                </Link>
                <p className="flex items-center gap-0.5">
                  <RatingIcon size={24} aria-label="rating" />
                  <span className="rating">{item.vote_average.toFixed(1)}</span>
                </p>

                <ul
                  aria-label="list of genres"
                  className="flex grow-0 flex-wrap gap-2"
                >
                  <UI_Brick value={item.genreNames} />
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      <ThumbnailCards
        items={normalize.slice(0, 5)}
        selectedIndex={selectedIndex}
        onSelect={(index) => selectSlideRef.current(index)}
      />
    </div>
  );
}

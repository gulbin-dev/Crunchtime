"use client";
import Link from "next/link";
import Image from "next/image";
import { MediaTypes, Movie, TV, Genre, Response } from "@utils/types";
import { RatingIcon } from "@utils/tabler-icons";
import { use, useRef } from "react";
import aggregateGenre from "@utils/aggregateGenre";
import UI_Brick from "@components/UI/UI_Brick";
import { gsap, useGSAP, Observer } from "@utils/gsap";
import FiveTrendLoader from "@components/UI/FiveTrendLoader";
import { memo } from "react";
const FiveTrend = memo(function FiveTrend({
  trending,
  movieGenres,
  tvGenres,
}: {
  trending: Promise<Response<MediaTypes>>;
  movieGenres: Promise<Response<Genre[]>>;
  tvGenres: Promise<Response<Genre[]>>;
}) {
  const { data: fiveTrend, error: fiveTrendError } = use(trending);
  const { data: movieGenre, error: movieGenreError } = use(movieGenres);
  const { data: tvGenre, error: tvGenreError } = use(tvGenres);
  const heroDivRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const trendingList = gsap.utils.toArray<HTMLDivElement>(".five-trend");

      if (trendingList.length === 0) return;

      let currentIndex = 0;
      let intervalId: NodeJS.Timeout | null = null;
      let isTweening = false; // Prevents continuous trigger flickers during touch holds

      // Set initial positions
      gsap.set(trendingList, { xPercent: 100 });
      gsap.set(trendingList[0], { xPercent: 0 });

      const playNext = (direction: number) => {
        if (isTweening) return;

        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = trendingList.length - 1;
        if (nextIndex >= trendingList.length) nextIndex = 0;

        // Prevent animating to the exact same slide
        if (nextIndex === currentIndex) return;

        isTweening = true; // Lock interactions during execution

        const currentSlide = trendingList[currentIndex];
        const nextSlide = trendingList[nextIndex];

        const currentEndMove = direction === 1 ? -100 : 100;
        const nextStartMove = direction === 1 ? 100 : -100;

        // Immediately update index before the animation fires
        currentIndex = nextIndex;

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

      const startAutoplay = () => {
        intervalId = setInterval(() => {
          playNext(1);
        }, 5000);
      };

      const resetAutoplay = () => {
        if (intervalId) clearInterval(intervalId);
        startAutoplay();
      };

      const obs = Observer.create({
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
      });

      startAutoplay();

      return () => {
        if (intervalId) clearInterval(intervalId);
        obs.kill();
      };
    },
    { scope: heroDivRef },
  );
  if (fiveTrendError.state || movieGenreError.state || tvGenreError.state) {
    return (
      <div ref={heroDivRef}>
        <FiveTrendLoader />
      </div>
    );
  }
  const genres = aggregateGenre(movieGenre, tvGenre);

  const normalize = fiveTrend
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
    });
  return (
    <div ref={heroDivRef} className="absolute inset-0 text-foreground-light">
      {normalize.map((item) => {
        return (
          <div
            key={item.id}
            className="five-trend flex absolute inset-0 top-0 left-0 w-full h-full"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
              alt=""
              fill
              loading="eager"
              placeholder="blur"
              blurDataURL={item.blurDataUrl}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="absolute inset-0  bg-black/50 z-10" />

            <div className="z-20 relative  top-32 left-3 w-[90vw] tablet:top-45 tablet:left-18">
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
                  className=" flex flex-wrap  grow-0 gap-2"
                >
                  <UI_Brick value={item.genreNames} />
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default FiveTrend;

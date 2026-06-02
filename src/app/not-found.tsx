"use client";

import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@hooks/redux-typed-hooks";
export default function NotFound() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      data-theme={theme}
      className="bg-primary text-foreground-primary w-full relative h-full flex flex-col  items-center justify-center pb-5 duration-300 transition-colors"
    >
      <h2 className="sr-only">Not Found</h2>
      <div className="max-w-[768px] w-full relative h-50 block">
        <Image
          src="/image/not-found-page.png"
          alt="Page not found"
          fill
          loading="eager"
          sizes="( max-width: 768px ) 100vw, ( max-width: 1200px ) 50vw, 33vw"
          className="object-contain object-center"
        />
      </div>
      <p className="text-center mt-5">Could not find requested resource</p>
      <Link
        href="/"
        className="text-foreground-light mt-5 rounded-2xl px-3 py-1.5 bg-cta hover:underline"
      >
        Return Home
      </Link>
    </div>
  );
}

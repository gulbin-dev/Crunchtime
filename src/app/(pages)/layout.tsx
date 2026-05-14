import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { SkeletonTheme } from "react-loading-skeleton";
import { SWRConfig } from "swr";
import { discoverMedia } from "@server/discoverMedia";
import { Suspense } from "react";
import PageLoader from "@/app/components/UI/PageLoader";
import { trendingList } from "@server/trendingList";
import { movieGenreList } from "@server/movieGenres";
import { tvGenreList } from "@server/tvGenres";
import "react-loading-skeleton/dist/skeleton.css";
import "@styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://crunchtime-gulbin-devs-projects.vercel.app/"),
  title: "CrunchTime | Movie List Demo",
  description:
    "A movie list demo website made by a frontend React web developer Joshua Glenn R. Gulbin. The website uses the TMDB API but is not endorsed, certified, or otherwise approved by TMDB.",
  authors: {
    name: "Joshua Glenn R. Gulbin",
    url: "https://github.com/gulbin-dev",
  },

  creator: "Joshua Glenn R. Gulbin",
  applicationName: "CrunchTime",
  generator: "Next.js",
  referrer: "strict-origin-when-cross-origin",

  openGraph: {
    title: "CrunchTime | Movie List Demo",
    description:
      "A movie list demo website made by a frontend React web developer Joshua Glenn R. Gulbin. The website uses the TMDB API but is not endorsed, certified, or otherwise approved by TMDB.",
    url: "https://crunchtime-gulbin-devs-projects.vercel.app/",
    siteName: "CrunchTime | Movie List Demo",
    type: "website",
    images: {
      url: "/og/website.jpg",
      width: 1200,
      height: 630,
      alt: "CrunchTime | Movie List Demo",
    },
  },

  keywords: [
    "crunchtime",
    "crunchtime demo",
    "movie list demo",
    "joshua glenn gulbin",
    "gulbindev",
  ],
  verification: {
    google: "KsgDFoZLb80qI6Hqcm1B1BDkNzJyutg-LLhi2XjwuXw",
  },
};

const poppins = Poppins({
  weight: ["400", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
  fallback: ["Arial"],
});
const roboto = Roboto({
  weight: "400",
  variable: "--font-roboto",
  subsets: ["latin"],
  fallback: ["sans serif"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [trending, action, animation, drama, heroTrend, movieGenre, tvGenre] =
    await Promise.all([
      discoverMedia("movie", [""]),
      discoverMedia("movie", ["28", "10759"]),
      discoverMedia("movie", ["16"]),
      discoverMedia("movie", ["18"]),
      trendingList(),
      movieGenreList(),
      tvGenreList(),
    ]);

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${roboto.variable}`}
      data-overlayscrollbars-initialize
    >
      <Suspense
        fallback={
          <body data-overlayscrollbars-initialize>
            <Header />
            <div className="flex items-center justify-center w-full h-screen">
              <PageLoader />
            </div>
            <Footer />
          </body>
        }
      >
        <SWRConfig
          value={{
            fallback: {
              "/api/catalog?mediaType=movie&genre=": trending,
              "/api/catalog?mediaType=movie&genre=28|10759": action,
              "/api/catalog?mediaType=movie&genre=16": animation,
              "/api/catalog?mediaType=movie&genre=18": drama,
              "/api/movie": movieGenre,
              "/api/tv": tvGenre,
              "/api/heroTrend": heroTrend,
            },
          }}
        >
          <body data-overlayscrollbars-initialize>
            <Analytics />

            <Header />
            <SkeletonTheme baseColor="#bcbcbc" highlightColor="#393939">
              {children}
            </SkeletonTheme>
            <Footer />
          </body>
        </SWRConfig>
      </Suspense>
    </html>
  );
}

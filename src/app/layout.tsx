import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import Header from "@components/Header";
import Footer from "@components/Footer";
import "@styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import ReduxProviderWrapper from "./(pages)/ReduxProviderWrapper";

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
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${roboto.variable}`}
      data-overlayscrollbars-initialize
    >
      <body data-overlayscrollbars-initialize>
        <Analytics />
        <ReduxProviderWrapper>
          <Header />
          {children}
          <Footer />
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}

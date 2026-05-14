import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/private/",
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
    ],

    sitemap: "https://crunchtime-gulbin-devs-projects.vercel.app/sitemap.xml",
  };
}

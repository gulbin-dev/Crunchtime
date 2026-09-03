import Link from "next/link";
import { LinkedinIcon, GithubIcon, GlobeIcon } from "@utils/tabler-icons";
import Image from "next/image";
import PageWrapper from "../PageWrapper";

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl leading-tight font-bold sm:text-5xl">
            About Crunchtime
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            A beautifully crafted movie and TV show discovery platform built
            with modern web technologies
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="mb-16 grid gap-12 md:grid-cols-2">
          {/* Developer Section */}
          <div className="flex flex-col justify-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">Created by</h2>
            <p className="text-foreground-dark mb-4 leading-relaxed dark:text-white">
              <span className="text-cta font-semibold">
                Joshua Glenn R. Gulbin
              </span>{" "}
              is a passionate{" "}
              <span className="font-semibold">Frontend React Developer</span>{" "}
              crafting seamless digital experiences.
            </p>
            <p className="mb-6 leading-relaxed text-gray-400">
              This project showcases modern React and Next.js practices,
              combining elegant design with robust functionality to create an
              engaging platform for exploring movies and TV shows.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold tracking-wide text-gray-400 uppercase">
                Connect
              </span>
              <ul className="flex gap-3 text-white">
                <li>
                  <Link
                    href="https://www.linkedin.com/in/joshua-glenn-gulbin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Navigate to the developer's LinkedIn Profile"
                    className="hover:bg-cta inline-flex transform items-center justify-center rounded-lg bg-gray-800 p-2 transition-all duration-300 hover:scale-110"
                  >
                    <LinkedinIcon size={24} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/gulbin-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Navigate to the developer's GitHub Profile"
                    className="hover:bg-cta inline-flex transform items-center justify-center rounded-lg bg-gray-800 p-2 transition-all duration-300 hover:scale-110"
                  >
                    <GithubIcon size={24} aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://portfolio-gulbindev.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Navigate to the developer's portfolio website"
                    className="hover:bg-cta inline-flex transform items-center justify-center rounded-lg bg-gray-800 p-2 transition-all duration-300 hover:scale-110"
                  >
                    <GlobeIcon size={24} aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* TMDB Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full rounded-lg bg-gray-800 p-8">
              <h3 className="mb-6 text-center text-xl font-bold text-white">
                Data Source
              </h3>
              <Image
                className="mx-auto mb-6"
                src="/image/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                alt="TMDB Logo"
                width={240}
                height={30}
              />
              <p className="text-center text-sm leading-relaxed text-gray-300">
                This platform leverages{" "}
                <span className="font-semibold">TMDB</span> and the{" "}
                <span className="font-semibold">TMDB APIs</span> to deliver
                comprehensive movie and TV show information.
              </p>
              <p className="mt-4 text-center text-xs text-gray-500 italic">
                This product uses the TMDB API but is not endorsed, certified,
                or otherwise approved by TMDB.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            What You&apos;ll Find Here
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Extensive Catalog",
                desc: "Browse thousands of movies and TV shows",
              },
              {
                title: "Smart Search",
                desc: "Find exactly what you're looking for instantly",
              },
              {
                title: "Genre Filtering",
                desc: "Discover content by your favorite genres",
              },
              {
                title: "Detailed Reviews",
                desc: "Read comprehensive information and ratings",
              },
              {
                title: "Personalized Lists",
                desc: "Track your favorite titles and preferences",
              },
              {
                title: "Modern Design",
                desc: "Enjoy a sleek, responsive user interface",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg bg-gray-800 p-6 transition-colors duration-300 hover:bg-gray-700"
              >
                <h3 className="text-cta mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="rounded-lg bg-gray-800 p-8">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Built With Modern Technology
          </h2>
          <div className="grid gap-4 text-center sm:grid-cols-2 md:grid-cols-3">
            {[
              "React 19",
              "Next.js 16",
              "TypeScript",
              "TailwindCSS v4",
              "Redux Toolkit",
              "SWR",
            ].map((tech) => (
              <div key={tech} className="rounded-lg bg-gray-700 px-4 py-3">
                <p className="font-medium text-gray-200">{tech}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Made with <span className="text-cta">♥</span> by a developer
            passionate about creating amazing digital experiences
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

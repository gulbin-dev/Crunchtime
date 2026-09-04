"use client";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, GlobeIcon } from "@utils/tabler-icons";
import { useAppSelector } from "@hooks/redux-typed-hooks";

export default function Footer() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <footer
      data-theme={theme}
      className="bg-primary text-foreground-primary border-t border-gray-700 transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">CrunchTime</h2>
            <p className="mb-4 text-sm leading-relaxed text-gray-400">
              Your ultimate destination for discovering movies and TV shows with
              comprehensive information and curated recommendations.
            </p>
            <p className="text-xs text-gray-500">
              A demo project showcasing modern React and Next.js best practices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-cta text-gray-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="hover:text-cta text-gray-400 transition-colors duration-200"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-cta text-gray-400 transition-colors duration-200"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Developer</h3>
            <p className="mb-4 text-sm text-gray-400">
              <span className="text-foreground-primary font-semibold">
                Joshua Glenn R. Gulbin
              </span>
              <br />
              Frontend React Developer
            </p>
            <p className="text-xs text-gray-500">
              Passionate about creating beautiful and functional web
              experiences.
            </p>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="flex flex-col items-center gap-6 border-y border-gray-700 py-8">
          <h3 className="text-lg font-semibold">Connect With Me</h3>
          <ul className="flex gap-4 text-white">
            <li>
              <Link
                href="https://www.linkedin.com/in/joshua-glenn-gulbin/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Navigate to the developer's LinkedIn Profile"
                className="hover:bg-cta inline-flex transform items-center justify-center rounded-lg bg-gray-800 p-3 transition-all duration-300 hover:scale-110"
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
                className="hover:bg-cta inline-flex transform items-center justify-center rounded-lg bg-gray-800 p-3 transition-all duration-300 hover:scale-110"
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
                className="hover:bg-cta inline-flex transform items-center justify-center rounded-lg bg-gray-800 p-3 transition-all duration-300 hover:scale-110"
              >
                <GlobeIcon size={24} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-gray-500 md:flex-row">
          <p>&copy; 2026 CrunchTime. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-cta">♥</span> using React & Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}

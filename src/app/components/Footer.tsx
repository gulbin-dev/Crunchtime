"use client";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, GlobeIcon } from "@utils/tabler-icons";
import { useAppSelector } from "@hooks/redux-typed-hooks";

export default function Footer() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <footer
      data-theme={theme}
      className="bg-primary text-foreground-primary flex w-full justify-center py-4 transition-colors duration-300"
    >
      <div className="h-full w-full max-w-7xl px-3">
        <h2 className="text-heading-lg">CrunchTime</h2>
        <p className="tablet:mt-2 tablet:px-3 mt-1">
          A{" "}
          <span className="font-bold">
            <em>demo website</em>
          </span>{" "}
          made by a frontend React web developer Joshua Glenn R. Gulbin.
        </p>

        <h3 className="tablet:text-heading-md tablet:mt-4 tablet:pl-5 mt-5">
          Social Links
        </h3>
        <ul className="tablet:mt-1 tablet:px-8 flex gap-2 p-3">
          <li>
            <Link
              href="https://www.linkedin.com/in/joshua-glenn-gulbin/"
              target="_blank"
              aria-label="Navigate to the developer's Linkedin Profile"
            >
              <LinkedinIcon className="text-heading-lg" aria-hidden />
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/gulbin-dev"
              target="_blank"
              aria-label="Navigate to the developer's Github Profile"
            >
              <GithubIcon className="text-heading-lg" aria-hidden />
            </Link>
          </li>
          <li>
            <Link
              href="https://portfolio-gulbindev.vercel.app/"
              target="_blank"
              aria-label="Navigate to the developer's portfolio website"
            >
              <GlobeIcon className="text-heading-lg" aria-hidden />
            </Link>
          </li>
        </ul>
        <p className="text-center">
          &copy; 2026 CrunchTime. All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { BsLinkedin, BsGithub, BsGlobe } from "react-icons/bs";
import Image from "next/image";
import PageWrapper from "../PageWrapper";
export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="p-3 max-w-7xl flex flex-col items-center justify-self-center w-full ">
        <p className="mt-5 text-justify inline-block max-w-100">
          This website is for{" "}
          <span className="font-bold">
            <em>demo purposes</em>
          </span>{" "}
          only made by frontend react web developer Joshua Glenn R. Gulbin.
        </p>

        <Image
          className="my-5"
          src="/image/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          alt="TMDB Logo"
          width={200}
          height={25}
        />
        <p>
          This website uses{" "}
          <span className="font-bold">
            <em>TMDB</em>
          </span>{" "}
          and the{" "}
          <span className="font-bold">
            <em>TMDB APIs</em>
          </span>{" "}
          but is not endorsed, certified, or otherwise approved by TMDB.
        </p>

        <h2 className="mt-5">Learn more about the developer</h2>

        <ul className="flex gap-2 p-3">
          <li>
            <Link
              href="https://www.linkedin.com/in/joshua-glenn-gulbin/"
              target="_blank"
              aria-label="Navigate to the developer's Linkedin Profile"
            >
              <BsLinkedin
                className="text-heading-xl text-cta bg-white p-1 rounded-md"
                aria-hidden
              />
            </Link>
          </li>
          <li>
            <Link
              href="https://github.com/gulbin-dev"
              target="_blank"
              aria-label="Navigate to the developer's Github Profile"
            >
              <BsGithub
                className="text-heading-xl text-cta bg-white p-1 rounded-md"
                aria-hidden
              />
            </Link>
          </li>
          <li>
            <Link
              href="https://portfolio-gulbindev.vercel.app/"
              target="_blank"
              aria-label="Navigate to the developer's portfolio website"
            >
              <BsGlobe
                className="text-heading-xl text-cta bg-white p-1 rounded-md"
                aria-hidden
              />
            </Link>
          </li>
        </ul>
      </div>
    </PageWrapper>
  );
}

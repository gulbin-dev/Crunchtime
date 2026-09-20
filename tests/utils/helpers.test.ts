import { describe, it, expect } from "vitest";
import { Genre } from "@utils/types/types";
import { avatarPathChecker } from "@utils/avatarPathChecker";
import { checkGenreName } from "@utils/checkGenreName";
import { normalizeData } from "@utils/normalizeData";
import { handleRuntime } from "@utils/previewHelpers";
import { aggregateGenre } from "@hooks/useGenres";
import {
  mediaTypeChecker,
  pageNumberChecker,
  sortOrderChecker,
  preventPathTraversal,
} from "@utils/serverPathChecker";

describe("how avatarPathChecker returns as expected", () => {
  it("should remove `/` if input has `/http` on it", () => {
    const input = "/http://hello-world.com";
    expect(avatarPathChecker(input)).toEqual("http://hello-world.com");
  });

  it("should return the image path", () => {
    const input = "/path-to-an-image.png";
    expect(avatarPathChecker(input)).toEqual(
      `https://image.tmdb.org/t/p/w92${input}`,
    );
  });
});

describe("how checkGenreName returns a value", () => {
  //simulate a mock data
  const genres: Genre[] = [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy & Action" },
  ];

  it("should return 2 genre IDs", () => {
    const genre = genres
      .filter((item) => checkGenreName(item, ["Action"]))
      .map((item) => item.id);
    expect(genre).toStrictEqual([1, 2]);
  });

  it("should return ID of Comedy genre", () => {
    const genre = genres
      .filter((item) => checkGenreName(item, ["Comedy"]))
      .map((item) => item.id);
    expect(genre).toStrictEqual([2]);
  });

  describe("how normalizeData construct a return props as expected", () => {
    const testCases = [
      {
        input: {
          id: 1,
          title: "JavaScript",
          genre_ids: [1, 2, 3],
        },
        expected: "JavaScript",
      },
      {
        input: {
          id: 2,
          name: "TypeScript",
          genre_ids: [1, 2, 3],
        },
        expected: "TypeScript",
      },
    ];
    it.each(testCases)(
      "should normalize the media item correctly for id $input.id",
      ({ input, expected }) => {
        const mockList = [input] as any[];
        const result = normalizeData(mockList, genres);

        // 1. Target the first index of the returned array using [0]
        expect(result).toHaveProperty(
          "[0].normalized.normalizeTitle",
          expected,
        );
      },
    );

    it("should return a never[] if first parameter is `undefined`", () => {
      expect(normalizeData(undefined, genres)).toStrictEqual([]);
    });
  });
});

describe("how previewHelpers return an expected string value", () => {
  it.each([
    { number: 60, expected: "1hour" },
    { number: 120, expected: "2hours" },
    { number: 121, expected: "2hours 1min" },
    { number: 130, expected: "2hours 10mins" },
  ])(
    "should input $number return the expected `$expected`",
    ({ number, expected }) => {
      expect(handleRuntime(number)).toBe(expected);
    },
  );
});

describe("how aggregateGenre handles and combines movie and tv genres", () => {
  const comedy = { id: 1, name: "Comedy" };
  const action = { id: 2, name: "Action" };
  const drama = { id: 3, name: "Drama" };
  const errorObj = { error: "Failed to fetch" };

  const testCases = [
    {
      description:
        "return an empty array when both movie and tv data are missing",
      param: { movie: undefined, tv: undefined },
      expected: [],
    },
    {
      description:
        "return an empty array when both inputs contain error objects",
      param: { movie: errorObj, tv: errorObj },
      expected: [],
    },
    {
      description:
        "return only movie genres when tv data is missing or has an error",
      param: { movie: { genres: [comedy, action] }, tv: errorObj },
      expected: [comedy, action],
    },
    {
      description:
        "return only tv genres when movie data is missing or has an error",
      param: { movie: undefined, tv: { genres: [drama] } },
      expected: [drama],
    },
    {
      description:
        "merge unique genres across both movie and tv datasets without duplicating",
      param: {
        movie: { genres: [comedy, action] },
        tv: { genres: [action, drama] }, // Action is shared
      },
      expected: [comedy, action, drama], // Action should only appear once
    },
  ];

  it.each(testCases)("should $description", ({ param, expected }) => {
    // Cast parameter as 'any' to bypass strict full interface testing definitions
    const result = aggregateGenre(param as any);
    expect(result).toEqual(expected);
  });
});

describe("Security and Input Validation Helpers", () => {
  describe("mediaTypeChecker", () => {
    it.each([
      { input: "movie", expected: "movie" },
      { input: "tv", expected: "tv" },
      { input: "malicious_string", expected: "tv" },
      { input: null, expected: "tv" },
      { input: undefined, expected: "tv" },
    ])("should return '$expected' when input is %p", ({ input, expected }) => {
      expect(mediaTypeChecker(input)).toBe(expected);
    });
  });

  describe("preventPathTraversal", () => {
    it.each([
      // Clean routes
      { input: "assets/images", expected: "assets/images" },
      { input: "videos/preview.mp4", expected: "videos/preview.mp4" },
      // Traversal attacks (should be blocked and return empty string)
      { input: "../secret/config", expected: "" },
      { input: "assets/../../etc/passwd", expected: "" },
      { input: "assets/./images", expected: "" }, // Current directory segment blocked
      // Empty segments and windows path sanitization
      { input: "assets//images", expected: "" }, // Empty segment blocked
      { input: "assets\\images", expected: "assets/images" }, // Normalizes backslashes
    ])("should return '$expected' for path: %p", ({ input, expected }) => {
      expect(preventPathTraversal(input)).toBe(expected);
    });
  });

  describe("sortOrderChecker", () => {
    it.each([
      { input: "asc", expected: "asc" },
      { input: "desc", expected: "desc" },
      { input: "SELECT * FROM users", expected: "desc" }, // Injection attempt
      { input: "ASC", expected: "desc" }, // Case sensitivity check
      { input: null, expected: "desc" },
    ])(
      "should return '$expected' when sort input is %p",
      ({ input, expected }) => {
        expect(sortOrderChecker(input)).toBe(expected);
      },
    );
  });

  describe("pageNumberChecker", () => {
    it.each([
      // Standard safe cases
      { input: "1", expected: 1 },
      { input: "42", expected: 42 },
      { input: "500", expected: 500 },
      // Upper and lower boundary violations
      { input: "0", expected: 1 },
      { input: "-5", expected: 1 },
      { input: "501", expected: 1 },
      { input: "99999", expected: 1 }, // Resource exhaustion protection
      // Malformed inputs
      { input: "not-a-number", expected: 1 },
      { input: "12abc", expected: 12 }, // parseInt stops at non-digit characters, so 12 is valid
      { input: null, expected: 1 },
    ])(
      "should return $expected when page string is %p",
      ({ input, expected }) => {
        expect(pageNumberChecker(input)).toBe(expected);
      },
    );
  });
});

"use client";

import Button from "@components/UI/Button";
export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <Button
        className="mt-5"
        config={{ type: "primary" }}
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => unstable_retry()
        }
      >
        Try again
      </Button>
    </div>
  );
}

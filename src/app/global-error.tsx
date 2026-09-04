"use client";

import Button from "./components/UI/Button";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <Button config={{ type: "primary" }} onClick={() => unstable_retry()}>
          Try again!!
        </Button>
      </body>
    </html>
  );
}

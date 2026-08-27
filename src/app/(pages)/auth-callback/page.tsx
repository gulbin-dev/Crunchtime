"use client";

import { useEffect, useState, Suspense } from "react"; // Added Suspense
import { useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Finalizing authentication...");

  useEffect(() => {
    const requestToken = searchParams.get("request_token");

    fetch(`/api/account/request-token?request_token=${requestToken}`, {
      method: "POST",
    })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(
              `Server returned HTML instead of JSON (${res.status}). Verify API file path.`,
            );
          }
          return res.json().then((data) => {
            throw new Error(data.error || "Failed to create session");
          });
        }
      })
      .catch((err) => {
        setStatus(`Authentication failed: ${err.message}`);
      });
  }, [searchParams]);

  return (
    <div className="bg-primary text-foreground-primary flex h-screen w-full items-center justify-center">
      <p className="text-heading-md font-semibold">{status}</p>
    </div>
  );
}

// Next.js requires useSearchParams() to be wrapped in a Suspense boundary
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}

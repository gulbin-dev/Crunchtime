"use client";

export default function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="w-full h-screen">
      <h2>{error.name}</h2>
      <p>{error.message}</p>
    </div>
  );
}

"use client";
export default function ReviewErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <h2>{error.name}</h2>
      <p>{error.message}</p>
    </div>
  );
}

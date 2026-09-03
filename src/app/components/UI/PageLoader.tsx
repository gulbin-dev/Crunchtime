"use client";
import { LoaderIcon } from "@utils/tabler-icons";
import { useAppSelector } from "@hooks/redux-typed-hooks";

export default function PageLoader() {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div
      data-theme={theme}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading"
      className="text-foreground-primary border-secondary/40 from-secondary/8 to-secondary/5 shadow-secondary/10 inline-flex items-center gap-3 rounded-full border bg-linear-to-r px-4 py-2 text-sm font-medium shadow-md backdrop-blur-md transition-all duration-300"
    >
      {/* Enhanced inline spinner dot */}
      <span
        className="desktop:hidden relative inline-flex h-2.5 w-2.5"
        aria-hidden="true"
      >
        <span className="bg-secondary motion-safe:animate-loader-pulse-dot shadow-secondary/50 absolute inline-flex h-full w-full rounded-full opacity-80 shadow-md" />
        <span className="bg-secondary relative inline-flex h-2.5 w-2.5 rounded-full" />
      </span>

      {/* Icon with reduced size for inline variant */}
      <LoaderIcon
        size={16}
        className="text-secondary motion-safe:animate-loader-icon-spin desktop:block hidden"
        strokeWidth={2}
        aria-hidden="true"
      />

      {/* Text with proper spacing */}
      <span className="font-medium">Loading</span>
    </div>
  );
}

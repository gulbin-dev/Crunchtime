"use client";
import { LoaderIcon } from "@utils/tabler-icons";
import { useAppSelector } from "@hooks/redux-typed-hooks";

type PageLoaderProps = {
  defaultColor?: string;
  variant?: "inline" | "full";
  label?: string;
};

export default function PageLoader({
  defaultColor,
  variant = "inline",
  label = "Loading",
}: PageLoaderProps) {
  const theme = useAppSelector((state) => state.theme.theme);
  const colorClass = defaultColor ?? "text-foreground-primary";

  if (variant === "full") {
    return (
      <div
        data-theme={theme}
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={label}
        className={`motion-safe:animate-fade-in-up relative flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 overflow-hidden px-4 py-10 sm:gap-6 ${colorClass}`}
      >
        {/* Ambient gradient orbs (decorative) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <span className="bg-cta/20 motion-safe:animate-fade-in-up absolute top-1/3 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl sm:h-56 sm:w-56" />
          <span className="bg-secondary/20 motion-safe:animate-orb-drift-alt absolute top-1/2 left-1/3 h-32 w-32 rounded-full blur-3xl sm:h-44 sm:w-44" />
        </div>

        {/* Spinner ring with gradient border + inner glow */}
        <div
          className="from-cta to-secondary relative grid h-16 w-16 place-items-center rounded-full bg-linear-to-br p-[3px] shadow-(--shadow-card) motion-safe:animate-(--animate-loader-ring-spin) sm:h-20 sm:w-20"
          aria-hidden="true"
        >
          <div className="bg-surface-elevated flex h-full w-full items-center justify-center rounded-full">
            <LoaderIcon
              size={28}
              className="text-cta motion-safe:animate-(--animate-loader-icon-spin) sm:hidden"
            />
            <LoaderIcon
              size={34}
              className="text-cta hidden motion-safe:animate-(--animate-loader-icon-spin) sm:block"
            />
          </div>
          {/* Pulsing outer ring */}
          <span className="ring-cta/40 pointer-events-none absolute inset-0 rounded-full ring-2 motion-safe:animate-(--animate-loader-pulse-ring)" />
        </div>

        {/* Label + animated dots */}
        <p className="flex items-center gap-2 text-sm font-semibold tracking-wide sm:text-base">
          <span>{label}</span>
          <span
            className="inline-flex items-center gap-1 align-middle"
            aria-hidden="true"
          >
            <span className="bg-cta h-1.5 w-1.5 rounded-full [animation-delay:-0.32s] motion-safe:animate-(--animate-loader-pulse-dot)" />
            <span className="bg-cta h-1.5 w-1.5 rounded-full [animation-delay:-0.16s] motion-safe:animate-(--animate-loader-pulse-dot)" />
            <span className="bg-cta h-1.5 w-1.5 rounded-full motion-safe:animate-(--animate-loader-pulse-dot)" />
          </span>
        </p>

        <span className="sr-only">{label}…</span>
      </div>
    );
  }
  return (
    <div
      data-theme={theme}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
      className={`border-cta/30 bg-cta/10 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-sm sm:text-sm ${colorClass}`}
    >
      <span className="relative inline-flex h-2 w-2" aria-hidden="true">
        <span className="bg-cta absolute inline-flex h-full w-full animate-(--animate-loader-pulse-dot) rounded-full opacity-75" />
        <span className="bg-cta relative inline-flex h-2 w-2 rounded-full" />
      </span>
      <LoaderIcon
        size={14}
        className="text-cta motion-safe:animate-(--animate-loader-icon-spin) sm:hidden"
        aria-hidden="true"
      />
      <LoaderIcon
        size={16}
        className="text-cta hidden motion-safe:animate-(--animate-loader-icon-spin) sm:block"
        aria-hidden="true"
      />
      <span>{label}</span>
      <span aria-hidden="true">…</span>
      <span className="sr-only">{label}…</span>
    </div>
  );
}

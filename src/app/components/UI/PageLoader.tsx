"use client";
import { LoaderIcon } from "@utils/tabler-icons";
import { useAppSelector } from "@hooks/redux-typed-hooks";
export default function PageLoader({
  defaultColor,
}: {
  defaultColor?: string;
}) {
  const theme = useAppSelector((state) => state.theme.theme);
  const hasDefaultColor = defaultColor !== undefined;
  return (
    <div
      data-theme={theme}
      className={`flex gap-1 ${hasDefaultColor ? defaultColor : ""}`}
    >
      <p>Loading</p>
      <LoaderIcon size={24} className="animate-spin" />
    </div>
  );
}

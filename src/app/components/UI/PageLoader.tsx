"use client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
      <AiOutlineLoading3Quarters className="animate-spin" />
    </div>
  );
}

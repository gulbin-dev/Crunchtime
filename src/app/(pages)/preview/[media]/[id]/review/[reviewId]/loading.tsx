"use client";
import PageLoader from "@components/UI/PageLoader";
import { useAppSelector } from "@hooks/redux-typed-hooks";

export default function ReviewLoading() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      data-theme={theme}
      className="bg-primary flex h-screen w-full items-center justify-center"
    >
      <PageLoader />
    </div>
  );
}

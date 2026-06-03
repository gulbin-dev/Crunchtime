"use client";
import PageLoader from "@components/UI/PageLoader";
import { useAppSelector } from "@hooks/redux-typed-hooks";

export default function ReviewLoading() {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <div
      data-theme={theme}
      className="h-screen w-full flex items-center justify-center"
    >
      <PageLoader />
    </div>
  );
}

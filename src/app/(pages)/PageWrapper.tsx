"use client";

import React from "react";
import { useAppSelector } from "@hooks/redux-typed-hooks";
import { ToastContainer } from "react-toastify";
export default function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <main
      data-theme={theme}
      className={`bg-primary text-foreground-primary relative w-full overflow-x-hidden transition-colors duration-300 ${className}`}
    >
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        theme="colored"
      />
      {children}
    </main>
  );
}

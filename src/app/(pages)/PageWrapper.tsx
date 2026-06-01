"use client";

import React from "react";
import { useAppSelector } from "@hooks/redux-typed-hooks";
export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAppSelector((state) => state.theme.theme);
  return <main data-theme={theme}>{children}</main>;
}

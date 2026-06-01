"use client";
import { Provider } from "react-redux";

import { store } from "@utils/redux-toolkit/store";
import React from "react";
export default function ReduxProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}

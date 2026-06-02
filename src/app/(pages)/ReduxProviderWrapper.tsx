"use client";
import { Provider } from "react-redux";
import { store } from "@utils/redux-toolkit/store";
import { useAppSelector } from "@hooks/redux-typed-hooks";
import { RootState } from "@utils/redux-toolkit/store";
import { useSyncExternalStore } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// creates a no-op subscribe function for useSyncExternalStore,
// as we don't need to subscribe to any external store for this component
const emptySubscribe = () => () => {};

const getServerSnapshot = () => false; // Server is never "mounted"
const getClientSnapshot = () => true; // Client is always "mounted"

const Rehydrated = ({ children }: { children: React.ReactNode }) => {
  const isRehydrated = useAppSelector<RootState>(
    (state) => state.reduxRemember.isRehydrated,
  );

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!isMounted || !isRehydrated) return;

  return <>{children}</>;
};

export default function ReduxProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Rehydrated>
        <SkeletonTheme
          baseColor="var(--color-cta-secondary)"
          highlightColor="var(--color-cta)"
        >
          {children}
        </SkeletonTheme>
      </Rehydrated>
    </Provider>
  );
}

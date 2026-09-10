"use client";
import { Provider } from "react-redux";
import { store } from "@utils/redux-toolkit/store";
import { useAppSelector } from "@hooks/redux-typed-hooks";
import { RootState } from "@utils/redux-toolkit/store";
import { useSyncExternalStore, Suspense } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// creates a no-op subscribe function for useSyncExternalStore,
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
      <Suspense fallback={null}>
        <Rehydrated>
          <SkeletonTheme
            baseColor="var(--color-secondary)"
            highlightColor="var(--color-secondary-darker)"
          >
            {children}
          </SkeletonTheme>
        </Rehydrated>
      </Suspense>
    </Provider>
  );
}

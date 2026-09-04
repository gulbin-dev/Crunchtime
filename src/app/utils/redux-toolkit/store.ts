import { configureStore } from "@reduxjs/toolkit";
import { rememberReducer, rememberEnhancer, Driver } from "redux-remember";
import themeReducer from "./slices/theme-slice";
import reduxRememberReducer from "./slices/redux-remember-slice";

const reducers = {
  theme: themeReducer,
  reduxRemember: reduxRememberReducer,
};

const rememberedKeys = ["theme"] satisfies (keyof typeof reducers)[];

// No-op storage for server-side rendering to avoid server-side errors with Web Storage API not being available on the server.
const createNoopStorage: Driver = {
  getItem() {
    return Promise.resolve(null);
  },
  setItem() {
    return Promise.resolve();
  },
};

const isServer = typeof window === "undefined";
const storage = isServer ? createNoopStorage : localStorage;

export const store = configureStore({
  reducer: rememberReducer(reducers),
  enhancers: (getDefault) =>
    getDefault().concat(
      rememberEnhancer(storage, rememberedKeys, {
        prefix: "@crunchtime-",
        serialize: (state) => JSON.stringify(state ?? {}),
      }),
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

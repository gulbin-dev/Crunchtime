import { createSlice, createAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";

interface ThemeStateType {
  theme: "light" | "dark";
}

interface LocalStorageThemeStateType {
  theme?: {
    theme: "light" | "dark";
  };
}
const getOSTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light"; // Server fallback
};

// OS theme preference initial state
const initialState: ThemeStateType = {
  theme: getOSTheme(),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
  extraReducers: (builder) => {
    builder
      // setting theme if the user has a saved theme state in localStorage
      .addCase(
        createAction<LocalStorageThemeStateType>(REMEMBER_REHYDRATED),
        (state, action) => {
          const getLocalStorageTheme = action.payload?.[themeSlice.name];
          state.theme = getLocalStorageTheme?.theme || getOSTheme(); // fallback to OS theme if no saved theme in localStorage
        },
      );
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

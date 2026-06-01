import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@utils/redux-toolkit/store";

// Define a type for the slice state
interface ThemeType {
  theme: "light" | "dark";
}

// Define the initial state using that type
const initialState: ThemeType = {
  theme: "light",
};

export const themeSlice = createSlice({
  name: "counter",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.theme === "light") {
        state.theme = "dark";
      } else {
        state.theme = "light";
      }
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const setTheme = (state: RootState) => state.theme;

export default themeSlice.reducer;

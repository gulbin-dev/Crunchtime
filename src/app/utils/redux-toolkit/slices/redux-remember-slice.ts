import { createSlice, createAction } from "@reduxjs/toolkit";
import { REMEMBER_REHYDRATED } from "redux-remember";

const initialState = {
  isRehydrated: false,
  isPersisted: false,
};

const reduxRemember = createSlice({
  name: "redux-remember",
  initialState,
  reducers: {}, // empty since I don't need any

  // Listen for the REMEMBER_REHYDRATED action to update the state
  // this happen when the state is loaded from a storage (e.g, localStorage, sessionStorage, etc.)
  // (see: https://redux-remember.js.org/usage/using-in-reducers/)
  extraReducers: (builder) =>
    builder.addCase(createAction(REMEMBER_REHYDRATED), (state) => {
      state.isRehydrated = true; // this is important to know when the state is ready to be used in the app
    }),
});

export default reduxRemember.reducer;

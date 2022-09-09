import { configureStore } from "@reduxjs/toolkit";
import { room } from "./slices";

export const store = configureStore({
  reducer: { room },
});

export * from "./slices";
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

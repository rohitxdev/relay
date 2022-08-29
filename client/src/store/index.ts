import { configureStore } from "@reduxjs/toolkit";
import { room } from "./room-slice";

export const store = configureStore({
  reducer: { room },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useContext } from "react";
import { AppContext } from "@context";

export function useAppContext() {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error("App context is null.");
  }
  return appContext;
}

import { AppContext } from "@context";
import { useContext } from "react";

export function useAppContext() {
  return useContext(AppContext) as AppContext;
}

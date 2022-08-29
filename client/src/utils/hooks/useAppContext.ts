import { AppContext } from "@context";
import { useContext } from "react";

export const useAppContext = () => {
  return useContext(AppContext) as AppContext;
};

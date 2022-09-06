import React, { createContext, ReactNode } from "react";

export interface AppContext {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}
export const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({ value, children }: { value: AppContext; children: ReactNode }) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

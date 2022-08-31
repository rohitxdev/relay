import React, { createContext, ReactNode } from "react";

export interface AppContext {
  isScreenShareAvailable: boolean;
  isRearCameraAvailable: boolean;
}
export const AppContext = createContext<AppContext | null>(null);

export const AppContextProvider = ({
  value,
  children,
}: {
  value: AppContext;
  children: ReactNode;
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

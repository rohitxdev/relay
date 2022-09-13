import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { createContext, ReactNode } from "react";

export interface RoomContext {
  username: string;
  screenUsername: string;
  client: IAgoraRTCClient;
  roomId: string;
}

export const RoomContext = createContext<RoomContext | null>(null);

export const RoomContextProvider = ({ value, children }: { value: RoomContext; children: ReactNode }) => {
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

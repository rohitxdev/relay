import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { createContext, ReactNode } from "react";

export interface RoomContext {
  roomId: string;
  username: string;
  client: IAgoraRTCClient;
}
export const RoomContext = createContext<RoomContext | null>(null);

export const RoomContextProvider = ({
  value,
  children,
}: {
  value: RoomContext;
  children: ReactNode;
}) => {
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

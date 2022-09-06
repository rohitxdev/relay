import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { createContext, ReactNode } from "react";

export interface RoomContext {
  roomId: string;
  username: string;
  screenUsername: string;
  client: IAgoraRTCClient;
  state: RoomState;
  dispatch: React.Dispatch<RoomAction>;
}
export const RoomContext = createContext<RoomContext | null>(null);

export const RoomContextProvider = ({ value, children }: { value: RoomContext; children: ReactNode }) => {
  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

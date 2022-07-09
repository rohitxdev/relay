import { IAgoraRTCClient } from "agora-rtc-sdk-ng";
import { createContext } from "react";
interface IPageContext {
  inPage?: string;
  setPage?: React.Dispatch<React.SetStateAction<string>>;
}
interface IRoomContext {
  client?: IAgoraRTCClient;
  username?: string | null;
  roomId?: string | null;
}
export const PageContext = createContext<IPageContext>({});
export const RoomContext = createContext<IRoomContext>({});

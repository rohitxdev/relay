import { createContext, ReactNode, useReducer } from "react";

const initialRoomState: RoomState = {
  isVideoOn: false,
  isMicOn: false,
  facingMode: "user",
  floatClient: false,
  isSharingScreen: false,
};

const roomReducer = (state: RoomState, action: { type: RoomActions; payload?: unknown }): RoomState => {
  const { type } = action;
  switch (type) {
    case "toggleVideo":
      return { ...state, isVideoOn: !state.isVideoOn };
    case "toggleMic":
      return { ...state, isMicOn: !state.isMicOn };
    case "toggleFacingMode":
      return { ...state, facingMode: state.facingMode === "user" ? "environment" : "user" };
    case "toggleFloatClient":
      return { ...state, floatClient: state.floatClient };
    case "toggleScreenShare":
      return { ...state, isSharingScreen: !state.isSharingScreen };
    case "resetRoomState":
      return initialRoomState;
    default:
      throw new Error("Invalid room action.");
  }
};

export const RoomContext = createContext<RoomContext | null>(null);

export const RoomContextProvider = ({ children }: { children: ReactNode }) => {
  const [roomState, roomDispatch] = useReducer(roomReducer, initialRoomState);

  return <RoomContext.Provider value={{ roomState, roomDispatch }}>{children}</RoomContext.Provider>;
};

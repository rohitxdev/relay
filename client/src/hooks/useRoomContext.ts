import { useContext } from "react";
import { RoomContext } from "@context";

export function useRoomContext() {
  const roomContext = useContext(RoomContext);
  if (!roomContext) {
    throw new Error("Room context is null.");
  }
  return roomContext;
}

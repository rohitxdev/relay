import { RoomContext } from "@context";
import { useContext } from "react";

export function useRoomContext() {
  return useContext(RoomContext) as RoomContext;
}

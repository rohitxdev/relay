import { RoomContext } from "@context";
import { useContext } from "react";

export const useRoomContext = () => {
  return useContext(RoomContext) as RoomContext;
};

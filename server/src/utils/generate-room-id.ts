import crypto from "crypto";
import { rooms } from "../models/mongodb.js";

export const generateRoomId = async () => {
  let roomId = crypto.randomInt(0, 10e9).toString(36).slice(0, 6);
  while (true) {
    if (!(await rooms.findOne({ room_id: roomId }))) {
      await rooms.insertOne({ room_id: roomId, members: [], chats: [] });
      return roomId;
    }
    roomId = crypto.randomInt(0, 10e9).toString(36);
  }
};

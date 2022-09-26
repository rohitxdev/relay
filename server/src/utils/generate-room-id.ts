import crypto from "crypto";
import { redis } from "./database.js";

export const generateRoomId = async () => {
  const expirationTimeInSeconds = 2 * 86400;
  let roomId = crypto.randomInt(0, 10e9).toString(36).slice(0, 6);
  while (true) {
    if (!(await redis.get(roomId))) {
      await redis.setEx(roomId, expirationTimeInSeconds, roomId);
      return roomId;
    }
    roomId = crypto.randomInt(0, 10e9).toString(36);
  }
};

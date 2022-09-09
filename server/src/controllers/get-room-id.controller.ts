import crypto from "crypto";
import { redis } from "../config/redis.js";
import { EXPIRATION_TIME_IN_SECONDS } from "../config/secrets.js";
import { Request, Response } from "express";

const generateRoomId = async () => {
  let roomId = crypto.randomInt(0, 10e9).toString(36).slice(0, 6);
  while (true) {
    if (!(await redis.get(roomId))) {
      await redis.setEx(roomId, EXPIRATION_TIME_IN_SECONDS, roomId);
      return roomId;
    }
    roomId = crypto.randomInt(0, 10e9).toString(36);
  }
};

export const getRoomIdController = async (req: Request, res: Response) => {
  try {
    const roomId = await generateRoomId();
    res.send(roomId);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

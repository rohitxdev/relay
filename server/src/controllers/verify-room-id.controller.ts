import { redis } from "../config/redis.js";
import { Request, Response } from "express";

export const verifyRoomIdController = async (req: Request, res: Response) => {
  const { roomId } = req.params;
  try {
    const data = await redis.get(roomId);
    if (data) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
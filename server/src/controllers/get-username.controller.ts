import { Request, Response } from "express";
import { redis } from "../utils/database.js";

export const getUsernameController = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    const username = await redis.get(uid);
    res.send(username);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

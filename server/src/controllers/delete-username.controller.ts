import { redis } from "../utils/database.js";
import { Request, Response } from "express";

export const deleteUsernameController = async (req: Request, res: Response) => {
  const { uid } = req.params;
  try {
    await redis.del(uid);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

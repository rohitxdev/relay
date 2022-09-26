import { RequestHandler } from "express";
import { redis } from "../utils/database.js";

export const deleteUsernameController: RequestHandler = async (req, res) => {
  const { uid } = req.params;
  try {
    await redis.del(uid);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

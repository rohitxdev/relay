import { RequestHandler } from "express";
import { redis } from "../utils/database.js";

export const getUsernameController: RequestHandler = async (req, res) => {
  const { uid } = req.params;
  try {
    const username = await redis.get(uid);
    res.send(username);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

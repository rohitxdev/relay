import { RequestHandler } from "express";
import { generateRoomId } from "../utils/generate-room-id.js";

export const getRoomIdController: RequestHandler = async (req, res) => {
  try {
    const roomId = await generateRoomId();
    res.send(roomId);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

import { RequestHandler } from "express";
import { rooms } from "../models/mongodb.js";

export const getUsernameController: RequestHandler<{ uid?: string }> = async (req, res) => {
  const { uid } = req.params;
  if (!uid) {
    return res.status(400).send("Agora UID not provided.");
  }
  const room = await rooms.findOne({ "members.agora_uid": uid });
  if (!room) {
    return res.status(404).send("No user found.");
  }
  const username = room.members.find((user) => user.agora_uid === uid)?.username;
  if (!username) {
    return res.status(404).send("No user found.");
  }
  return res.send(username);
};

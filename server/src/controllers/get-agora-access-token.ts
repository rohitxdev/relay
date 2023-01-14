import crypto from "crypto";
import { RequestHandler } from "express";
import agoraAccessToken from "agora-access-token";
import { AGORA_APP_ID, AGORA_APP_CERTIFICATE, EXPIRATION_TIME_IN_SECONDS } from "../config/secrets.js";
import { rooms } from "../models/mongodb.js";
import { ObjectId } from "mongodb";

const { RtcRole, RtcTokenBuilder } = agoraAccessToken;

export const getAgoraAccessTokenController: RequestHandler = async (req, res) => {
  try {
    const { roomId, username } = req.query;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const appId = AGORA_APP_ID as string;
    const appCertificate = AGORA_APP_CERTIFICATE as string;
    const channelName = roomId as string;
    const uid = crypto.randomUUID();
    const role = RtcRole.PUBLISHER;
    const privilegeExpiredTs = currentTimestamp + EXPIRATION_TIME_IN_SECONDS;
    const accessToken = RtcTokenBuilder.buildTokenWithAccount(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );
    if (!username || typeof username !== "string") {
      return res.status(400).send("Username not provided.");
    }
    await rooms.updateOne(
      { room_id: roomId },
      { $push: { members: { username, agora_uid: uid, mongo_id: new ObjectId() } } }
    );
    return res.send({ appId, uid, accessToken });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

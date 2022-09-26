import crypto from "crypto";
import { RequestHandler } from "express";
import agoraAccessToken from "agora-access-token";
import { secrets } from "../utils/secrets.js";
import { redis } from "../utils/database.js";

const { AGORA_APP_ID, AGORA_APP_CERTIFICATE, EXPIRATION_TIME_IN_SECONDS } = secrets;
const { RtcRole, RtcTokenBuilder } = agoraAccessToken;

export const getAccessTokenController: RequestHandler = async (req, res) => {
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
    await redis.setEx(uid, EXPIRATION_TIME_IN_SECONDS, username as string);
    res.send({ appId, uid, accessToken });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

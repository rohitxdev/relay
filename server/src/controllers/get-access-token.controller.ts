import crypto from "crypto";
import { Request, Response } from "express";
import agoraAccessToken from "agora-access-token";
import { redis } from "../config/redis.js";
import { AGORA_APP_ID, AGORA_APP_CERTIFICATE, EXPIRATION_TIME_IN_SECONDS } from "../config/secrets.js";

const { RtcRole, RtcTokenBuilder } = agoraAccessToken;

export const getAccessTokenController = async (req: Request, res: Response) => {
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

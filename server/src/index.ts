import crypto from "crypto";
import cors from "cors";
import agoraAccessToken from "agora-access-token";
import express from "express";
import { config } from "dotenv";
import { createClient } from "redis";

config({ path: "../.env" });
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
const server = express();
const { RtcRole, RtcTokenBuilder } = agoraAccessToken;

const redis = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_ROLE,
  password: process.env.REDIS_PASSWORD,
});
server.use(cors());
server.use(express.static("../../client/dist/"));

server.get("/api", (req, res) => {
  res.send("*Cricket sounds*");
});
const EXPIRATION_TIME = 2 * 60 * 60 * 24;
server.get("/api/get-room-id", async (req, res) => {
  const generateRoomId = async () => {
    let roomId = crypto.randomInt(0, 10e9).toString(36);
    await redis.connect();
    while (true) {
      if (!(await redis.get(roomId))) {
        await redis.setEx(roomId, EXPIRATION_TIME, roomId);
        await redis.quit();
        return roomId;
      }
      roomId = crypto.randomInt(0, 10e9).toString(36);
    }
  };
  const roomId = await generateRoomId();
  res.send(roomId);
});

server.get("/api/verify-room-id", async (req, res) => {
  const { roomId } = req.query as { roomId: string };
  await redis.connect();
  if (await redis.get(roomId)) {
    res.send(true);
  } else {
    res.send(false);
  }
});

server.get("/api/get-access-token", async (req, res) => {
  const {
    query: { roomId, username },
  } = req;
  const expirationTimeInSeconds = 86400;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const channelName = roomId as string;
  const uid = crypto.randomUUID();
  const role = RtcRole.PUBLISHER;
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const accessToken = RtcTokenBuilder.buildTokenWithAccount(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.send({ appId, uid, accessToken });
});

server.get("/api/get-username", async (req, res) => {
  const { roomId, uid } = req.query as { roomId: string; uid: string };
});

server.delete("/api/remove-username", async (req, res) => {
  const { roomId, uid } = req.query as { roomId: string; uid: string };
  res.send(true);
});

server.get("/api/get-og-image", async (req, res) => {
  res.sendFile(`/assets/spark.jpg`, { root: "../" });
});

server.listen(PORT, HOST, async () => {
  console.log(`Server is listening to http://${HOST}:${PORT}`);
});

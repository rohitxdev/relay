import crypto from "crypto";
import cors from "cors";
import agoraAccessToken from "agora-access-token";
import express from "express";
import { config } from "dotenv";
import { createClient } from "redis";

config({ path: "../.env" });
const { RtcRole, RtcTokenBuilder } = agoraAccessToken;
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
const EXPIRATION_TIME_IN_SECONDS = 2 * 86400;
const server = express();
const redis = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

server.use(cors());
server.use(express.static("../../client/dist/"));
await redis.connect();

const generateRoomId = async () => {
  let roomId = crypto.randomInt(0, 10e9).toString(36).slice(0, 7);
  while (true) {
    if (!(await redis.get(roomId))) {
      await redis.setEx(roomId, EXPIRATION_TIME_IN_SECONDS, roomId);
      return roomId;
    }
    roomId = crypto.randomInt(0, 10e9).toString(36);
  }
};

const addUsernameToDb = async (uid: string, username: string) => {
  try {
    await redis.setEx(uid, EXPIRATION_TIME_IN_SECONDS, username);
  } catch (error) {
    console.log(error);
  }
};

const getUsernameFromDb = async (uid: string) => {
  try {
    const username = await redis.get(uid);
    return username;
  } catch (error) {
    console.log(error);
    return "anonymous";
  }
};

const deleteUsernameFromDb = async (uid: string) => {
  try {
    await redis.getDel(uid);
  } catch (error) {
    console.log(error);
  }
};

server.get("/api", (req, res) => {
  res.send("*Cricket sounds*");
});

server.get("/api/get-room-id", async (req, res) => {
  const roomId = await generateRoomId();
  res.send(roomId);
});

server.get("/api/verify-room-id/:roomId", async (req, res) => {
  const {
    params: { roomId },
  } = req;
  try {
    await redis.get(roomId);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

server.get("/api/get-access-token", async (req, res) => {
  const {
    query: { roomId, username },
  } = req;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const appId = process.env.AGORA_APP_ID as string;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE as string;
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
  await addUsernameToDb(uid, username as string);
  res.send({ appId, uid, accessToken });
});

server.get("/api/get-username/:uid", async (req, res) => {
  const {
    params: { uid },
  } = req;
  const username = await getUsernameFromDb(uid as string);
  res.send(username);
});

server.get("/api/delete-username/:uid", async (req, res) => {
  const {
    params: { uid },
  } = req;
  deleteUsernameFromDb(uid as string);
  res.status(200);
});

server.get("/api/get-og-image", async (req, res) => {
  res.sendFile(`/assets/spark.jpg`, { root: "../" });
});

server.listen(PORT, HOST, async () => {
  console.log(
    `✨ Server is running on \u001b[35;1mhttp://${HOST}:${PORT}\u001b[0m in \u001b[37;1m${process.env.NODE_ENV}\u001b[0m environment ✨`
  );
});

import crypto from "crypto";
import cors from "cors";
import agoraAccessToken from "agora-access-token";
import express from "express";
import { config } from "dotenv";
import { createClient } from "redis";
import { EXPIRATION_TIME_IN_SECONDS, HOST, PORT } from "./utils/constants.js";

config({ path: "../.env" });
const { RtcRole, RtcTokenBuilder } = agoraAccessToken;
const server = express();
server.use(cors(), express.static("../../client/dist/"));

const redis = createClient({
  url: process.env.REDIS_URL,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});
await redis.connect();

export const generateRoomId = async () => {
  let roomId = crypto.randomInt(0, 10e9).toString(36).slice(0, 6);
  while (true) {
    if (!(await redis.get(roomId))) {
      await redis.setEx(roomId, EXPIRATION_TIME_IN_SECONDS, roomId);
      return roomId;
    }
    roomId = crypto.randomInt(0, 10e9).toString(36);
  }
};

server.get("/api", (req, res) => {
  res.send("<h3>*Cricket sounds*</h3>");
});

server.get("/api/get-room-id", async (req, res) => {
  try {
    const roomId = await generateRoomId();
    res.send(roomId);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.sendStatus(500);
  }
});

server.post("/api/verify-room-id/:roomId", async (req, res) => {
  const { roomId } = req.params;
  try {
    const data = await redis.get(roomId);
    if (data) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.sendStatus(500);
  }
});

server.get("/api/get-access-token", async (req, res) => {
  const { roomId, username } = req.query;
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
  try {
    await redis.setEx(uid, EXPIRATION_TIME_IN_SECONDS, username as string);
    res.send({ appId, uid, accessToken });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.sendStatus(500);
  }
});

server.get("/api/get-username/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    const username = await redis.get(uid);
    res.send(username);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.sendStatus(500);
  }
});

server.delete("/api/delete-username/:uid", async (req, res) => {
  const { uid } = req.params;
  try {
    await redis.del(uid);
    res.status(200);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    res.sendStatus(500);
  }
});

server.get("/api/get-og-image", async (req, res) => {
  res.sendFile(`banner.png`, { root: "../../client/dist/" });
});

server.get("*", (req, res) => {
  if (req.headers.accept?.includes("text/html")) {
    res.sendFile("index.html", { root: "../../client/dist" });
  } else {
    res.sendStatus(404);
  }
});

server.listen(PORT, HOST, async () => {
  console.log(
    `✨ Server is running on \u001b[35;1mhttp://${HOST}:${PORT}\u001b[0m in \u001b[37;1m${process.env.NODE_ENV}\u001b[0m environment ✨`
  );
});

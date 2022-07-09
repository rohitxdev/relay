import { getDatabase, ref, set, get, child, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import crypto from "crypto";
import fs from "fs";
import cors from "cors";
import agoraAccessToken from "agora-access-token";
import express from "express";
import { config } from "dotenv";

config({ path: "../.env" });
const PORT = Number(process.env.PORT || 4000);
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
const { RtcRole, RtcTokenBuilder } = agoraAccessToken;
const server = express();
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
server.use(cors());
server.use(express.static("../../client/dist/"));

server.get("/api/get-room-id", async (request, reply) => {
  const generateRoomId = async () => {
    let currentTimestamp = Math.floor(Date.now() / 1000);
    let roomId = crypto.randomInt(0, 10e9).toString(36);
    let snapshot = await get(child(ref(getDatabase()), `/rooms/${roomId}`));
    while (snapshot.exists()) {
      currentTimestamp = Math.floor(Date.now() / 1000);
      roomId = crypto.randomInt(0, 10e9).toString(36);
      snapshot = await get(child(ref(getDatabase()), `/rooms/${roomId}`));
    }
    await set(ref(db, `/rooms/${roomId}`), { roomId, currentTimestamp });
    return roomId;
  };
  const roomId = await generateRoomId();
  reply.send(roomId);
});

server.get("/api/verify-room-id", async (request, reply) => {
  const { roomId } = request.query as { roomId: string };
  const snapshot = await get(child(ref(getDatabase()), `/rooms/${roomId}`));
  if (snapshot.exists()) {
    reply.send(true);
  } else {
    reply.send(false);
  }
});

server.get("/api/get-access-token", async (request, reply) => {
  const { roomId, username } = request.query as { roomId: string; username: string };
  const expirationTimeInSeconds = 86400;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const channelName = roomId;
  const uid = crypto.randomUUID();
  const role = RtcRole.PUBLISHER;
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  //Generate access token.
  const accessToken = RtcTokenBuilder.buildTokenWithAccount(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );
  //Add username to database.
  update(ref(db, `/rooms/${roomId}`), { [uid]: username });
  reply.send({ appId, uid, accessToken });
});

server.get("/api/get-username", async (request, reply) => {
  const { roomId, uid } = request.query as { roomId: string; uid: string };
  const snapshot = await get(child(ref(getDatabase()), `/rooms/${roomId}`));
  reply.send(snapshot.val()[uid]);
});

server.delete("/api/remove-username", async (request, reply) => {
  const { roomId, uid } = request.query as { roomId: string; uid: string };
  await update(ref(db, `/rooms/${roomId}`), { [uid]: null });
  reply.send(true);
});

server.get("/api/get-og-image", async (request, reply) => {
  const stream = fs.createReadStream("./assets/spark.jpg");
  reply.type("image/jpeg").send(stream);
});

server.listen(PORT, HOST, () => {
  console.log(`Server is listening to http://${HOST}:${PORT}`);
});

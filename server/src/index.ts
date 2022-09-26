import cors from "cors";
import express from "express";
import { secrets } from "./utils/secrets.js";
import {
  entryPointController,
  verifyRoomIdController,
  deleteUsernameController,
  getAccessTokenController,
  getRoomIdController,
  getUsernameController,
  wildcardController,
} from "./controllers/index.js";

const server = express();
const { HOST, PORT, NODE_ENV } = secrets;

server.use(cors(), express.static("../../client/dist/"));

server.get("/api", entryPointController);

server.get("/api/verify-room-id/:roomId", verifyRoomIdController);

server.get("/api/get-room-id", getRoomIdController);

server.get("/api/get-access-token", getAccessTokenController);

server.get("/api/get-username/:uid", getUsernameController);

server.delete("/api/delete-username/:uid", deleteUsernameController);

server.get("*", wildcardController);

server.listen(PORT, HOST, () => {
  const ENV = NODE_ENV === "development" ? `\u001b[33;1m${NODE_ENV}` : `\u001b[32;1m${NODE_ENV}`;
  console.log(
    `\u001b[37;1mServer is listening to \u001b[35;1mhttp://${HOST}:${PORT}\u001b[0m \u001b[37;1mand running in ${ENV}\u001b[0m \u001b[37;1menvironment...`
  );
});

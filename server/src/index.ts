import { HOST, PORT, NODE_ENV } from "./config/secrets.js";
import cors from "cors";
import express from "express";
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
server.use(cors(), express.static("../../client/dist/"));

server.get("/api", entryPointController);

server.get("/api/verify-room-id/:roomId", verifyRoomIdController);

server.get("/api/get-room-id", getRoomIdController);

server.get("/api/get-access-token", getAccessTokenController);

server.get("/api/get-username/:uid", getUsernameController);

server.delete("/api/delete-username/:uid", deleteUsernameController);

server.get("*", wildcardController);

server.listen(PORT, HOST, () => {
  console.log(
    `✨ Server is running on \u001b[35;1mhttp://${HOST}:${PORT}\u001b[0m in \u001b[37;1m${NODE_ENV}\u001b[0m environment ✨`
  );
});

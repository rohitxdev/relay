import cors from "cors";
import express from "express";
import { secrets } from "./utils/secrets.js";
import { connectToDb } from "./utils/database.js";
import { deleteUsernameController } from "./controllers/delete-username-controller.js";
import { entryPointController } from "./controllers/entry-point-controller.js";
import { getAccessTokenController } from "./controllers/get-access-token-controller.js";
import { getRoomIdController } from "./controllers/get-room-id-controller.js";
import { getUsernameController } from "./controllers/get-username-controller.js";
import { verifyRoomIdController } from "./controllers/verify-room-id-controller.js";
import { wildcardController } from "./controllers/wildcard-controller.js";

const { PORT, HOST, NODE_ENV } = secrets;
const server = express();
connectToDb();

server.use(cors(), express.static("../../client/dist/"));
server.delete("/api/delete-username/:uid", deleteUsernameController);
server.get("/api", entryPointController);
server.get("/api/verify-room-id/:roomId", verifyRoomIdController);
server.get("/api/get-room-id", getRoomIdController);
server.get("/api/get-access-token", getAccessTokenController);
server.get("/api/get-username/:uid", getUsernameController);
server.get("*", wildcardController);

server.listen(PORT, HOST, () => {
  const ENV = NODE_ENV === "development" ? `\u001b[33;1m${NODE_ENV}` : `\u001b[32;1m${NODE_ENV}`;
  console.log(
    `\u001b[37;1mServer is listening to \u001b[35;1mhttp://${HOST}:${PORT}\u001b[0m \u001b[37;1mand running in ${ENV}\u001b[0m \u001b[37;1menvironment...`
  );
});

import cors from "cors";
import express from "express";
import http from "node:http";
import cookieParser from "cookie-parser";
import { connectToMongoDb } from "./utils/database.js";
import { catchAllController } from "./controllers/catch-all.js";
import { HOST, NODE_ENV, PORT } from "./config/secrets.js";
import { apiRouter } from "./routes/apiRoutes.js";
import { LiveChatServer } from "./utils/live-chat-server.js";

const app = express();
const server = http.createServer(app);
const liveChatServer = new LiveChatServer(server);
liveChatServer.init();
connectToMongoDb();

app.use(cors(), express.static("../../client/dist/"), cookieParser(), express.json());
app.use("/api", apiRouter);
app.get("*", catchAllController);

server.listen(PORT, HOST, () => {
  const ENV = NODE_ENV === "development" ? `\u001b[33;1m${NODE_ENV}` : `\u001b[32;1m${NODE_ENV}`;
  console.log(
    `\u001b[37;1mServer is listening to \u001b[35;1mhttp://${HOST}:${PORT}\u001b[0m \u001b[37;1mand running in ${ENV}\u001b[0m \u001b[37;1menvironment...`
  );
});

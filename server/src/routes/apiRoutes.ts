import express from "express";
import { rootController } from "../controllers/root.js";
import { getAgoraAccessTokenController } from "../controllers/get-agora-access-token.js";
import { getRoomIdController } from "../controllers/get-room-id.js";
import { getUsernameController } from "../controllers/get-username.js";
import { verifyRoomIdController } from "../controllers/verify-room-id.js";
import { authRouter } from "./authRoutes.js";

export const apiRouter = express.Router();
apiRouter.use(express.urlencoded({ extended: true }), express.json());
apiRouter.use("/auth", authRouter);
apiRouter.get("/", rootController);
apiRouter.get("/verify-room-id/:roomId", verifyRoomIdController);
apiRouter.get("/get-room-id", getRoomIdController);
apiRouter.get("/get-agora-access-token", getAgoraAccessTokenController);
apiRouter.get("/get-username/:uid", getUsernameController);

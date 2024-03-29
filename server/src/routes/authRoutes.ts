import cookieParser from "cookie-parser";
import { Router } from "express";
import { logInController } from "../controllers/log-in.js";
import { logOutController } from "../controllers/log-out.js";
import { getAccessTokenController } from "../controllers/get-access-token.js";
import { signUpController } from "../controllers/sign-up.js";

export const authRouter = Router();

authRouter.use(cookieParser());
authRouter.post("/sign-up", signUpController);
authRouter.post("/log-in", logInController);
authRouter.get("/log-out", logOutController);
authRouter.get("/get-access-token", getAccessTokenController);

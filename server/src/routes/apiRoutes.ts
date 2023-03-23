import express from "express";
import { authRouter } from "./authRoutes.js";
import { serviceRouter } from "./serviceRoutes.js";

export const apiRouter = express.Router();

apiRouter.use(express.urlencoded({ extended: true }), express.json());
apiRouter.use("/auth", authRouter);
apiRouter.use("/", serviceRouter);

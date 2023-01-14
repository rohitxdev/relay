import { RequestHandler } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS, JWT_REFRESH_TOKEN_SECRET } from "../config/secrets.js";
import { users } from "../models/mongodb.js";

export const logInController: RequestHandler<any, any, { username?: string; password?: string }> = async (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(400).send(`Username or password not provided.`);
  }
  if (req.cookies.refresh_token && jwt.verify(req.cookies.refresh_token, JWT_REFRESH_TOKEN_SECRET)) {
    return res.status(400).send("User is already logged in.");
  }
  const user = await users.findOne({ username });
  if (!user) {
    return res.status(401).send(`User does not exist.`);
  }
  const hashedPassword = crypto.scryptSync(password, user.salt, 128).toString(`hex`);
  if (hashedPassword !== user.hashedPassword) {
    return res.status(401).send(`Password is incorrect.`);
  }

  const refreshToken = jwt.sign({ username }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "90d" });
  return res.status(200).cookie("refresh_token", refreshToken, COOKIE_OPTIONS).send("User logged in successfully.");
};

import { RequestHandler } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { users } from "../models/mongodb.js";
import { COOKIE_OPTIONS, JWT_REFRESH_TOKEN_SECRET } from "../config/secrets.js";

export const signUpController: RequestHandler<
  any,
  any,
  { username?: string; email?: string; password?: string }
> = async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username && email && password)) {
    return res.status(400).send("Required user credentials not provided.");
  }
  //Check if a user with the same email or username already exists.
  const query1 = users.findOne({ email });
  const query2 = users.findOne({ username });
  const queryRes = await Promise.all([query1, query2]);
  if (queryRes[0]) {
    return res.status(400).send("User with this email already exists.");
  }
  if (queryRes[1]) {
    return res.status(400).send("Username is already taken.");
  }
  const salt = crypto.randomBytes(64).toString("hex");
  const hashedPassword = crypto.scryptSync(password, salt, 128).toString(`hex`);
  await users.insertOne({ email, username, hashedPassword, salt });
  const refreshToken = jwt.sign({ username }, JWT_REFRESH_TOKEN_SECRET, { expiresIn: "90d" });
  console.log(username);

  return res
    .status(200)
    .cookie("refresh_token", refreshToken, COOKIE_OPTIONS)
    .send("Signed up & logged in successfully.");
};

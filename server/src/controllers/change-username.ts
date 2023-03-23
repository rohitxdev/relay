import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_TOKEN_SECRET } from "../config/secrets.js";
import { users } from "../models/mongodb.js";

export const changeUsernameController: RequestHandler<any, any, { newUsername: string | undefined }> = async (
  req,
  res
) => {
  const { refresh_token: refreshToken } = req.cookies;

  const { newUsername } = req.body;
  if (!(newUsername && refreshToken)) {
    return res.status(400).send("Missing information in request body.");
  }
  try {
    const { username } = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
    if (!username) {
      return res.sendStatus(400);
    }
    const user = await users.findOne({ username });
    if (!user) {
      users.findOneAndUpdate({ username }, { $set: { username: newUsername } });
    } else {
      return res.status(400).send("Username is already taken.");
    }
    return res.sendStatus(200);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.sendStatus(403);
    }
    return res.sendStatus(500);
  }
};

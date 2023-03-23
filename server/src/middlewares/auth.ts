import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET } from "../config/secrets.js";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).send(`Authorization header not present in request.`);
  }
  if (!authorization.startsWith(`Bearer `) || !(authorization.split(` `).length === 2)) {
    return res.status(400).send(`Invalid authorization header.`);
  }
  const accessToken = authorization.split(` `)[1];
  try {
    jwt.verify(accessToken, JWT_ACCESS_TOKEN_SECRET);
    return next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(403).send(`Access token expired.`);
    }
    return res.sendStatus(500);
  }
};

import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { COOKIE_OPTIONS, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../config/secrets.js";
const { TokenExpiredError } = jwt;

export const getAccessTokenController: RequestHandler = async (req, res) => {
  const { refresh_token: refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).send("Refresh token not provided.");
  }
  try {
    const decodedToken = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
    if (typeof decodedToken !== "object") {
      throw new Error("Error in decoding the old access token,");
    }
    delete decodedToken.exp;
    delete decodedToken.iat;
    const newAccessToken = jwt.sign(decodedToken, JWT_ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
    const { username } = decodedToken;
    return res.json({
      accessToken: newAccessToken,
      username: username,
      tokenExpiryTimeInMs: 1000 * 60 * 10,
    });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res
        .clearCookie("refresh_token", COOKIE_OPTIONS)
        .status(401)
        .send("User has been logged out due to expired credentials.");
    } else {
      return res.sendStatus(500);
    }
  }
};

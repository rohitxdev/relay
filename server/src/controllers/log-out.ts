import { RequestHandler } from "express";
import { COOKIE_OPTIONS } from "../config/secrets.js";

export const logOutController: RequestHandler = async (req, res) => {
  if (req.cookies.refresh_token) {
    res.clearCookie("refresh_token", COOKIE_OPTIONS);
    return res.status(200).send("Logged out successfully");
  } else {
    return res.status(400).send("Already logged out.");
  }
};

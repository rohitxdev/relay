import { config } from "dotenv";
import { CookieOptions } from "express";
config({ path: "../.env" });

export const PORT = Number(process.env.PORT) || 80;
export const HOST = process.env.HOST ?? "0.0.0.0";
export const EXPIRATION_TIME_IN_SECONDS = 2 * 86400;
export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/api/auth/",
};

if (
  !(
    process.env.NODE_ENV &&
    process.env.AGORA_APP_ID &&
    process.env.AGORA_APP_CERTIFICATE &&
    process.env.JWT_ACCESS_TOKEN_SECRET &&
    process.env.JWT_REFRESH_TOKEN_SECRET &&
    process.env.MONGO_URL
  )
) {
  throw new Error("Some environment variables are undefined.");
}

export const {
  NODE_ENV,
  AGORA_APP_ID,
  AGORA_APP_CERTIFICATE,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  MONGO_URL,
} = process.env;

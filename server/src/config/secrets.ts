import { config } from "dotenv";
config({ path: "./config/.env" });

export const PORT = Number(process.env.PORT) || 4000;
export const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1";
export const EXPIRATION_TIME_IN_SECONDS = 2 * 86400;
export const { NODE_ENV, REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD, AGORA_APP_ID, AGORA_APP_CERTIFICATE } = process.env;

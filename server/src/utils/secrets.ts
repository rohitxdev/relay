import { config } from "dotenv";
config({ path: "../.env" });

const PORT = Number(process.env.PORT) || 4000;
const HOST = "0.0.0.0";
const EXPIRATION_TIME_IN_SECONDS = 2 * 86400;
const { NODE_ENV, DB_URL, AGORA_APP_ID, AGORA_APP_CERTIFICATE } = process.env;

export const secrets = {
  PORT,
  HOST,
  EXPIRATION_TIME_IN_SECONDS,
  NODE_ENV,
  DB_URL,
  AGORA_APP_ID,
  AGORA_APP_CERTIFICATE,
};

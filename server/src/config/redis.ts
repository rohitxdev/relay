import { createClient } from "redis";
import { REDIS_URL, REDIS_USERNAME, REDIS_PASSWORD } from "./secrets.js";

export const redis = createClient({
  url: REDIS_URL,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
});

await redis.connect();

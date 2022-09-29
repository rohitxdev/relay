import { secrets } from "./secrets.js";
import { createClient } from "redis";

const { DB_URL, DB_USERNAME, DB_PASSWORD } = secrets;
export const redis = createClient({
  url: DB_URL,
  username: DB_USERNAME,
  password: DB_PASSWORD,
});

export const connectToDb = async () => {
  try {
    await redis.connect();
    console.log("\u001b[37;1mConnected to remote Redis Database... 🌏🔖");
  } catch (err) {
    console.log("\u001b[31;1mError: Server could not connect to remote Redis Database");
    console.error(err);
  }
};

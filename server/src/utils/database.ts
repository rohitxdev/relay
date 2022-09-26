import { createClient } from "redis";
import { secrets } from "./secrets.js";

const { DB_URL, DB_USERNAME, DB_PASSWORD } = secrets;
export const redis = createClient({
  url: DB_URL,
  username: DB_USERNAME,
  password: DB_PASSWORD,
});

redis
  .connect()
  .then(() => {
    console.log("\u001b[37;1mConnected to remote Redis Database... 🌏🔖");
  })
  .catch((e) => {
    console.log(e);
  });

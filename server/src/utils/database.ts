import { createClient } from "redis";
import { secrets } from "./secrets.js";

const { DB_URL } = secrets;
export const redis = createClient({
  url: DB_URL,
});

redis
  .connect()
  .then(() => {
    console.log("\u001b[37;1mConnected to remote Redis Database... 🌏🔖");
  })
  .catch((e) => {
    console.log(e);
  });

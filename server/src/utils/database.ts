import { mongoClient } from "../models/mongodb.js";

export const connectToMongoDb = async () => {
  await mongoClient.connect();
  console.log("\u001b[37;1mConnected to remote MongoDB Database... 🍃");
};

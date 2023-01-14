import { MongoClient, ObjectId } from "mongodb";
import { MONGO_URL } from "../config/secrets.js";
import { ChatMessage } from "../types/relay-server.js";

export const mongoClient = new MongoClient(MONGO_URL as string);

interface UserCollection {
  email: string;
  username: string;
  hashedPassword: string;
  salt: string;
}

interface RoomCollection {
  room_id: string;
  members: { username: string; agora_uid: string; mongo_id: ObjectId }[];
  chats: ChatMessage[];
}

export const db = mongoClient.db("relay");
export const users = db.collection<UserCollection>("users");
export const rooms = db.collection<RoomCollection>("rooms");

rooms.createIndex("room_id", { expireAfterSeconds: 2 * 86400 });

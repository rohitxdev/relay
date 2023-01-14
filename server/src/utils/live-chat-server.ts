import http from "node:http";
import { Server } from "socket.io";
import { rooms } from "../models/mongodb.js";
import { ChatMessage } from "../types/relay-server.js";

export class LiveChatServer {
  #io: Server;

  constructor(httpServer: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>) {
    this.#io = new Server(httpServer);
  }

  init() {
    this.#io.on("connect", (socket) => {
      const { roomId, username } = socket.handshake.query;
      if (!(roomId && username)) return socket.disconnect();

      rooms.findOne({ room_id: roomId }).then((room) => {
        socket.emit("old-texts", room?.chats);
      });
      socket.join(roomId);

      socket.broadcast.to(roomId).emit("join", username);

      socket.on("typing", () => {
        socket.broadcast.to(roomId).emit("typing", username);
      });

      socket.on("not-typing", () => {
        socket.broadcast.to(roomId).emit("not-typing", username);
      });

      socket.on("text", (text: ChatMessage) => {
        socket.broadcast.to(roomId).emit("text", text);
        rooms.findOneAndUpdate({ room_id: roomId }, { $push: { chats: text } });
      });

      socket.on("disconnect", () => {
        socket.broadcast.to(roomId).emit("not-typing", username);
        socket.broadcast.to(roomId).emit("leave", username);
      });

      return;
    });
  }
}

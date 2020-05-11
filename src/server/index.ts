import express from "express";
import { Server } from "http";
import socketio from "socket.io";
import { resolve } from "path";
import { config } from "dotenv";

config();
const app = express();
const server = new Server(app);
const io = socketio(server);

app.get("/", (req, res) => {
  res.sendFile(resolve("./public/api-status.html"));
});

io.on("connection", (socket) => {
  console.log("user joined");
  io.emit("server_message", "user joined");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 3003;

server.listen(WEBSOCKET_PORT, () => {
  console.log(`listening on port ${WEBSOCKET_PORT}`);
});

import express from "express";
import { Server } from "http";
import socketio from "socket.io";
import { resolve } from "path";

const app = express();
const server = new Server(app);
const io = socketio(server);

app.get("/", (req, res) => {
  res.sendFile(resolve("./app/index.html"));
});

io.on("connection", (socket) => {
  console.log("user joined");
  io.emit("server_message", "user joined");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

server.listen(3001, () => {
  console.log("listening on port 3001");
});

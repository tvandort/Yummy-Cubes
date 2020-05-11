import express from "express";
import { Server } from "http";
import socketio from "socket.io";
import { resolve } from "path";

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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

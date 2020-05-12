const express = require("express");
const next = require("next");
const socketio = require("socket.io");
const { createServer } = require("http");

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const app = express();
const nextHandler = nextApp.getRequestHandler();
const server = createServer(app);
const io = socketio(server);

// api
const apiRouter = express.Router();
apiRouter.get("hello-world", (req, res) => {
  res.send("Hello, world!");
});

// sockets
io.on("connection", (socket) => {
  console.log("user joined");
  io.emit("server_message", "user joined");

  socket.on("message", (message) => {
    console.log(message);
    io.emit("message", message);
  });
});

nextApp.prepare().then(() => {
  app.all("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

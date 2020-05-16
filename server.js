const express = require('express');
const next = require('next');
const socketio = require('socket.io');
const { createServer } = require('http');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const app = express();
const nextHandler = nextApp.getRequestHandler();
const server = createServer(app);
const io = socketio(server);

// api
const apiRouter = express.Router();
apiRouter.get('hello-world', (req, res) => {
  res.send('Hello, world!');
});

const gameState = {
  players: []
};

const random = () => Math.random() * 1000;

// sockets
io.on('connection', (socket) => {
  io.emit('message', { name: 'system', message: 'user joined' });

  socket.on('message', (args) => {
    io.emit('message', args);
  });

  socket.on('add_player', (name) => {
    console.log(`adding ${name}`);
    if (!gameState.players.some((player) => player.name === name)) {
      gameState.players.push({ name, position: { x: random(), y: random() } });
    }

    io.emit('game', gameState);
  });

  socket.on('move', (move) => {
    const player = gameState.players.filter(
      (player) => player.name === move.name
    )[0];
    if (player) {
      player.position = move.position;
    }

    io.emit('game', gameState);
  });
});

nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

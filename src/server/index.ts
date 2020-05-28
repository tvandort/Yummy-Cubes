// The following line sets up aliased imports. I thought that nextjs would do
// this for me but it turns out that this is not the case for any code running
// in a custom server. So many things need to be taken care of manually.
// The config for this is currently in package.json which means there are
// Three locations to change if you want to add an alias across all parts of
// this project.
// 1. tsconfig.json       - all frontend code and editor
// 2. package.json        - all custom sever code
// 3. jest.config.json    - all tests
// 4. .storybook/main.js  - all storybook files
import 'module-alias/register';

import next from 'next';
import socketio from 'socket.io';
import { createServer } from 'http';
import express from 'express';

import routes from './routes';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const app = express();
const nextHandler = nextApp.getRequestHandler();
const server = createServer(app);
const io = socketio(server);

const gameState: {
  players: { name: string; position: { x: number; y: number } }[];
} = {
  players: []
};

const random = () => Math.random() * 1000;

// sockets
io.on('connection', (socket) => {
  console.log('someone connected');
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
  app.use('/api', routes);

  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

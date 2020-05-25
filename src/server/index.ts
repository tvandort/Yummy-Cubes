// Don't use aliased imports in this file. Unfortunately it doesn't seem to work.
// That might be due to how next bootstraps. Maybe that aliasing isn't set up
// until some process early in the pipeline starts / builds.
import next from 'next';
import socketio from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import * as D from 'io-ts/lib/Decoder';

import { validator } from './validator';
import { RoomsController } from './roomsController';
import { Rooms } from '../fakedb/rooms';

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

const fooDec = D.type({
  test: D.literal('test')
});

nextApp.prepare().then(() => {
  const rooms = new Rooms();
  const roomsController = new RoomsController({ rooms });
  app.get('/foo', validator(fooDec));
  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

import { Router } from 'express';
import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/server/fakedb/rooms';
import { newRoomRequestDecoder } from '@app/shared/validators/roomTypes';
import { validator } from '@app/server/validator';
import { RoomsManager } from './roomsManager';
import { Server } from 'socket.io';

const createRouter = ({ server }: { server: Server }) => {
  const router = Router();

  const rooms = new Rooms();
  const roomsManager = new RoomsManager({ rooms, io: server });
  const roomsController = new RoomsController({
    roomsManager
  });

  router.post(
    '/rooms',
    validator(newRoomRequestDecoder),
    roomsController.joinRoom
  );

  return router;
};

export default createRouter;

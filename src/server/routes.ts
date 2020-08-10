import { Router } from 'express';
import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/server/fakedb/rooms';
import { newRoomRequestDecoder } from '@app/shared/validators/roomTypes';
import { validator } from '@app/server/validator';

const router = Router();

const rooms = new Rooms();
const roomsController = new RoomsController({
  rooms
});

router.post(
  '/rooms',
  validator(newRoomRequestDecoder),
  roomsController.joinRoom
);

export default router;

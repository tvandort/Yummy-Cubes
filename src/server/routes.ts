import { Router } from 'express';
import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/fakedb/rooms';

const router = Router();

const rooms = new Rooms();
const roomsController = new RoomsController({ rooms });

router.route('/rooms').post(roomsController.newRoom);

export default router;

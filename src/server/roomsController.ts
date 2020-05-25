import { Rooms } from '@app/fakedb/rooms';
import { ParamsDictionary } from 'express-serve-static-core';
import { Request, Response } from 'express';

export class RoomsController {
  private rooms: Rooms;
  constructor({ rooms }: { rooms: Rooms }) {
    this.rooms = rooms;
  }

  newRoom(
    _req: Request<ParamsDictionary, any, { test: 'test' }>,
    res: Response<{ id: string }>
  ) {
    const newRoom = { id: 'test' };
    this.rooms.add(newRoom);

    res.json({ id: newRoom.id });
  }
}

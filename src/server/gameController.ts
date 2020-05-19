import { NextApiResponse, NextApiRequest } from 'next';
import { Room } from '@app/fakedb/rooms';

export class RoomsController {
  private rooms: Room[];
  constructor(rooms: Room[]) {
    this.rooms = rooms;
  }

  newRoom(req: NextApiRequest, res: NextApiResponse) {
    const newRoom = { id: 'test' };
    this.rooms.push(newRoom);

    res.json({ id: newRoom.id });
  }
}

import { Rooms, Room } from '@app/server/fakedb/rooms';
import { ParamsDictionary } from 'express-serve-static-core';
import { Request, Response } from 'express';
import {
  NewRoomRequest,
  NewRoomResponse
} from '@app/shared/validators/roomTypes';

const handler = <RequestType, ResponseType>(
  fn: (
    req: Request<ParamsDictionary, ResponseType, RequestType>,
    res: Response<ResponseType>
  ) => void
) => (
  req: Request<ParamsDictionary, ResponseType, RequestType>,
  res: Response<ResponseType>
) => fn(req, res);

export class RoomsController {
  private rooms: Rooms;

  constructor({ rooms }: { rooms: Rooms }) {
    this.rooms = rooms;
  }

  joinRoom = handler<NewRoomRequest, NewRoomResponse>((req, res) => {
    const roomId = req.body.roomId;
    let code: number;
    let room: Room;
    if (this.rooms.exists(roomId)) {
      room = this.rooms.get(roomId);
      code = 200;
    } else {
      room = { id: roomId, players: [] };
      this.rooms.add(room);
      code = 201;
    }

    room.players.push({ userIdentifier: 'players-id' });

    res.status(code).json({ roomId });
  });
}

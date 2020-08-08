import { Rooms } from '@app/server/fakedb/rooms';
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
  private roomIdGenerator: () => string;

  constructor({
    rooms,
    roomIdGenerator
  }: {
    rooms: Rooms;
    roomIdGenerator: () => string;
  }) {
    this.rooms = rooms;
    this.roomIdGenerator = roomIdGenerator;
  }

  joinRoom = handler<NewRoomRequest, NewRoomResponse>((req, res) => {
    const newRoom = { id: this.roomIdGenerator() };
    this.rooms.add(newRoom);
    res.json({ roomId: newRoom.id });
  });
}

import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/server/fakedb/rooms';
import { ParamsDictionary } from 'express-serve-static-core';

const exampleId = 'example-id';

describe('game controller', function () {
  it('responds with OK for a new room player joins to', () => {
    const rooms = new Rooms();
    const { controller } = setup({ rooms });
    const mockRequest = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    controller.joinRoom(
      { body: { roomId: exampleId } } as any,
      mockRequest as any
    );

    expect(mockRequest.json).toHaveBeenCalledWith({ roomId: exampleId });
    expect(rooms.exists(exampleId)).toBeTruthy();
    const room = rooms.get(exampleId);

    expect(room.players.length).toBe(1);
  });

  it('response OK if the room is not full', () => {
    const room = { id: 'room-id', players: [] };
    const { controller } = setup({ rooms: new Rooms({ rooms: [room] }) });
    const json = jest.fn();
    controller.joinRoom({} as any, { json } as any);
    expect(json).toHaveBeenCalledWith({ roomId: exampleId });
  });

  const setup = ({ rooms }: { rooms: Rooms } = { rooms: new Rooms() }) => {
    const controller = new RoomsController({
      rooms
    });

    return {
      rooms,
      controller
    };
  };
});

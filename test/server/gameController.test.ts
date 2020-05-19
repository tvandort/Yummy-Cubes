import { RoomsController } from '@app/server/gameController';
import { Room } from '@app/fakedb/rooms';
import { NextApiRequest, NextApiResponse } from 'next';

describe('game controller', function () {
  it('creates a new game', () => {
    const { controller, rooms } = setup();

    controller.newRoom(
      {} as NextApiRequest,
      { json: (data) => data } as NextApiResponse
    );
    expect(rooms).toHaveLength(1);
  });

  it('it responds with the newly created id', () => {
    const { controller, rooms } = setup();
    const json = jest.fn();
    controller.newRoom({} as NextApiRequest, { json } as any);
    expect(json).toHaveBeenCalledWith({ id: 'test' });
  });

  const setup = () => {
    const rooms: Room[] = [];
    const controller = new RoomsController(rooms);

    return {
      rooms,
      controller
    };
  };
});

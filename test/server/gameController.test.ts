import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/fakedb/rooms';

describe('game controller', function () {
  it('creates a new game', () => {
    const { controller, rooms } = setup();

    controller.newRoom({} as any, { json: (data: any) => data } as any);
    expect(rooms).toHaveLength(1);
  });

  it('it responds with the newly created id', () => {
    const { controller } = setup();
    const json = jest.fn();
    controller.newRoom({} as any, { json } as any);
    expect(json).toHaveBeenCalledWith({ id: 'test' });
  });

  const setup = () => {
    const rooms = new Rooms();
    const controller = new RoomsController({ rooms });

    return {
      rooms,
      controller
    };
  };
});

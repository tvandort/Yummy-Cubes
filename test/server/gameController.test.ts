import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/server/fakedb/rooms';

const exampleId = 'example-id';

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
    expect(json).toHaveBeenCalledWith({ roomId: exampleId });
  });

  const setup = () => {
    const rooms = new Rooms();
    const controller = new RoomsController({
      rooms,
      roomIdGenerator: () => exampleId
    });

    return {
      rooms,
      controller
    };
  };
});

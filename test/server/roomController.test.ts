import { RoomsController } from '@app/server/roomsController';
import { Rooms } from '@app/server/fakedb/rooms';

const exampleId = 'example-id';

describe('game controller', function () {
  it('it responds with OK if user can join room', () => {
    const { controller } = setup();
    const json = jest.fn();
    controller.joinRoom({} as any, { json } as any);
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

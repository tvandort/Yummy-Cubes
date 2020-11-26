import { RoomsController } from '@app/server/roomsController';
import { Rooms, Room } from '@app/server/fakedb/rooms';
import { RoomsManager, IRoomsManager } from '@app/server/roomsManager';
import { Server } from 'socket.io';

const exampleId = 'example-id';

describe('game controller', function () {
  it('responds with OK for a new room player joins to', () => {
    const { controller, joinRoom } = setup();
    const mockResponse = createMockResponse();

    const code = 'test-code';
    joinRoom.mockReturnValue({ new: true, code });

    controller.joinRoom(
      {
        body: { roomId: exampleId },
        cookies: { 'user-identity': 'test' }
      } as any,
      mockResponse as any
    );

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      roomId: exampleId,
      code
    });
  });

  it('responds with OK for an existing room and a new player joins', () => {
    const { controller, joinRoom } = setup();
    const mockResponse = createMockResponse();

    const code = 'test-code';
    joinRoom.mockReturnValue({ new: false, code });

    controller.joinRoom(
      {
        body: { roomId: exampleId },
        cookies: { 'user-identity': 'test' }
      } as any,
      mockResponse as any
    );

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      roomId: exampleId,
      code
    });
  });

  it('responds with a 400 for a player joining a full room', () => {
    const { controller, joinRoom } = setup();
    const mockResponse = createMockResponse();
    const roomError = 'Room is full';

    joinRoom.mockImplementation(() => {
      throw new Error(roomError);
    });

    controller.joinRoom(
      {
        body: { roomId: exampleId },
        cookies: { 'user-identity': 'test' }
      } as any,
      mockResponse as any
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.statusMessage).toEqual(roomError);
  });

  const createMockResponse = () => ({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    statusMessage: ''
  });

  const setup = () => {
    const joinRoom = jest.fn();
    const roomsManager: IRoomsManager = { joinRoom };
    const controller = new RoomsController({
      roomsManager
    });

    return {
      joinRoom,
      controller
    };
  };
});

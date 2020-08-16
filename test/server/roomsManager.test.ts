import { RoomsManager } from '@app/server/roomsManager';
import { Rooms, Room } from '@app/server/fakedb/rooms';
import { Server } from 'socket.io';

describe(RoomsManager, () => {
  describe('new room', () => {
    test('that we can join the room', () => {
      const player1 = 'player-1';
      const socketServer = {} as Server;
      const rooms = new Rooms();
      const manager = new RoomsManager({ rooms, io: socketServer });

      const result = manager.joinRoom('example-id', player1);
      const room = rooms.get('example-id');

      expect(result.new).toBeTruthy();
      expect(
        room.Players.some((player) => player.userIdentifier === player1)
      ).toBeTruthy();
    });
  });

  describe('existing room joined by a new player', () => {
    test('that second player can join room', () => {
      const roomId = 'example-id';
      const [player1, player2] = ['player-1', 'player-2'];
      const socketServer = {} as Server;
      const room = new Room({
        id: roomId,
        players: [{ userIdentifier: player1 }]
      });
      const rooms = new Rooms({ rooms: [room] });
      const manager = new RoomsManager({ rooms, io: socketServer });

      const result = manager.joinRoom(roomId, player2);

      expect(result.new).toBeFalsy();
      expect(room.Players.length).toBe(2);
      expect(room.Players.some((player) => player.userIdentifier === player1));
      expect(room.Players.some((player) => player.userIdentifier === player2));
    });
  });

  describe('room is full', () => {
    test('that error is thrown after 5 people try to join', () => {
      const roomId = 'example-id';
      const [player1, player2, player3, player4, player5] = [
        'player-1',
        'player-2',
        'player-3',
        'player-4',
        'player-5'
      ];
      const socketServer = {} as Server;
      const room = new Room({
        id: roomId
      });
      const rooms = new Rooms({ rooms: [room] });
      const manager = new RoomsManager({ rooms, io: socketServer });

      manager.joinRoom(roomId, player1);
      manager.joinRoom(roomId, player2);
      manager.joinRoom(roomId, player3);
      manager.joinRoom(roomId, player4);

      expect(() =>
        manager.joinRoom(roomId, player5)
      ).toThrowErrorMatchingInlineSnapshot(`"Room already full."`);
    });

    test('that error is thrown', () => {
      const roomId = 'example-id';
      const players = ['player-1', 'player-2', 'player-3', 'player-4'];
      const player5 = 'player-5';
      const socketServer = {} as Server;
      const room = new Room({
        id: roomId,
        players: players.map((userIdentifier) => ({ userIdentifier }))
      });
      const rooms = new Rooms({ rooms: [room] });
      const manager = new RoomsManager({ rooms, io: socketServer });

      expect(() =>
        manager.joinRoom(roomId, player5)
      ).toThrowErrorMatchingInlineSnapshot(`"Room already full."`);
    });
  });
});

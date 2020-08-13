import { Rooms, Room } from './fakedb/rooms';
import { Room as SocketRoom, Server } from 'socket.io';

export class RoomsManager {
  private rooms: Rooms;
  private io: SocketIOClientStatic;

  constructor({ rooms }: { rooms: Rooms; io: Server }) {
    this.rooms = rooms;
    this.io = io;
  }

  joinRoom = (roomId: string, playerId: string) => {
    let room: Room;
    if (this.rooms.exists(roomId)) {
      room = this.rooms.get(roomId);
    } else {
      room = { id: roomId, players: [] };
      this.rooms.add(room);
    }

    const full = room.players.length >= 4;
    const playerInRoomAlready = room.players.some(
      (player) => player.userIdentifier === playerId
    );
    if (playerInRoomAlready) {
      // respond 200 with existing unique code that gets sent to the react page from the server.
    } else if (!full) {
      // register them
      room.players.push({ userIdentifier: playerId });
      // respond 201 with new unique code that gets sent to the react page from the server.
      // room should be named based on the url slug however.
    } else {
      // not in room and can't be joined to room. throw?
    }
  };
}

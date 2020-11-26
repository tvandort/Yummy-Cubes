import { Rooms, Room, Player } from './fakedb/rooms';
import { Room as SocketRoom, Server } from 'socket.io';
import { v4 } from 'uuid';

export interface IJoinRoomResult {
  new: boolean;
  code: string;
  nickname: string;
  promptName: boolean;
}

export interface IRoomsManager {
  joinRoom: (params: { roomId: string; playerId: string }) => IJoinRoomResult;
}

export class RoomsManager implements IRoomsManager {
  private rooms: Rooms;
  private io: Server;

  constructor({ rooms, io }: { rooms: Rooms; io: Server }) {
    this.rooms = rooms;
    this.io = io;
  }

  joinRoom = ({ roomId, playerId }: { roomId: string; playerId: string }) => {
    let room: Room;
    let roomExistsAlready = this.rooms.exists(roomId);
    if (roomExistsAlready) {
      room = this.rooms.get(roomId);
    } else {
      room = new Room({ id: roomId, players: [], code: v4() });
      this.rooms.add(room);
    }

    const full = room.Players.length >= 4;
    const matchingPlayers = room.Players.filter(
      (player) => player.userIdentifier === playerId
    );
    const playerInRoomAlready = matchingPlayers.length > 0;
    if (playerInRoomAlready) {
      // respond 200 with existing unique code that gets sent to the react page from the server.
      const player = matchingPlayers[0];
      return {
        new: !roomExistsAlready,
        code: room.Code,
        nickname: player.nickname,
        promptName: player.promptName
      };
    } else if (!full) {
      // register them
      const player: Player = {
        userIdentifier: playerId,
        nickname: `Player ${room.Players.length + 1}`,
        promptName: true
      };
      room.Players.push(player);
      // respond 201 with new unique code that gets sent to the react page from the server.
      // room should be named based on the url slug however.
      return {
        new: !roomExistsAlready,
        code: room.Code,
        nickname: player.nickname,
        promptName: player.promptName
      };
    } else {
      // not in room and can't be joined to room. throw?
      throw new Error('Room already full.');
    }
  };
}
